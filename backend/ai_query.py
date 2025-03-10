"""Ziel & Funktion:
	•	Implementiert das AI-Feature: Nimmt natürliche Sprachabfragen entgegen und wandelt sie mithilfe der OpenAI API in SQL-Abfragen um.
	•	Führt eine Validierung und Optimierung der generierten SQL-Abfragen durch, bevor diese an die Datenbank übergeben werden.
Abhängigkeiten:
	•	Greift auf database.py zur Ausführung von Abfragen zu und auf Umgebungsvariablen (z. B. OpenAI API-Key) aus der .env zu.
"""

import os
import re
import json
import openai
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError
from .database import db_session
import uuid
from sqlalchemy import text

# Create a Blueprint for AI query routes
ai_query_routes = Blueprint('ai_query_routes', __name__)

# Initialize OpenAI client
def get_openai_client():
    """Initialize and return the OpenAI client with API key from environment."""
    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OpenAI API key is not set in the environment variables")
    
    # Initialize the client with the API key
    client = openai.OpenAI(api_key=api_key)  # Ensure no unsupported arguments are passed
    return client

def generate_sql_from_natural_language(query_text):
    """Convert natural language query to SQL using OpenAI API.
    
    Args:
        query_text (str): The natural language query from the user.
        
    Returns:
        str: Generated SQL query.
    """
    try:
        client = get_openai_client()
        
        # Prepare the system message with database schema information
        system_message = """
        You are an AI assistant that converts natural language queries into SQL queries.
        The database has a table called 'battery_data' with the following columns:
        - id (Integer, primary key)
        - batt_alias (String, not null)
        - country (String)
        - continent (String)
        - climate (String)
        - iso_a3 (String(3))
        - model_series (Integer)
        - var (String, not null)
        - val (Float, not null)
        - descr (String)
        - cnt_vhcl (Integer)
        
        Generate a valid SQL query that can be executed against this schema.
        Only return the SQL query without any explanations or markdown formatting.
        Do not use wildcard (*) selects - always specify column names explicitly.
        Do not use JOIN operations.
        """
        
        # Call the OpenAI API to generate SQL
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Convert this natural language query to SQL: {query_text}"}
            ],
            temperature=0.1,  # Lower temperature for more deterministic outputs
            max_tokens=500
        )
        
        # Extract the SQL query from the response
        sql_query = response.choices[0].message.content.strip()
        
        # Remove any markdown code block formatting if present
        sql_query = re.sub(r'^```sql\n|^```\n|\n```$', '', sql_query, flags=re.MULTILINE)
        
        return sql_query
    
    except Exception as e:
        raise Exception(f"Error generating SQL from natural language: {str(e)}")

def validate_sql_query(sql_query):
    """Validate and sanitize the generated SQL query for security.
    
    Args:
        sql_query (str): The SQL query to validate.
        
    Returns:
        tuple: (is_valid, sanitized_query or error_message)
    """
    # Convert to lowercase for easier pattern matching
    sql_lower = sql_query.lower()
    
    # Check for dangerous SQL operations with case-insensitive flag
    dangerous_patterns = [
        r'\bdelete\b', r'\bdrop\b', r'\btruncate\b', r'\balter\b', 
        r'\bcreate\b', r'\binsert\b', r'\bupdate\b', r'\bmerge\b',
        r'\bexec\b', r'\bexecute\b', r'--', r';\s*\w', r'xp_cmdshell',
        # Additional dangerous patterns
        r'\bunion\b', r'\bintersect\b', r'\bexcept\b',  # SQL set operations that could be used for injection
        r'\binto\s+outfile\b', r'\binto\s+dumpfile\b',  # File operations
        r'\bload_file\b', r'\bsys_eval\b',              # File and system operations
        r'\bsystem_user\b', r'\bcurrent_user\b',        # User information
        r'\bschema\b', r'\binformation_schema\b',       # Database metadata
        r'\bpg_\w+\b',                                  # PostgreSQL system functions
        r'\bpg_sleep\b', r'\bwaitfor\s+delay\b'         # Time-based attacks
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, sql_query, re.IGNORECASE):
            return False, f"Dangerous SQL operation detected: {pattern}"
    
    # Ensure the query is a SELECT statement
    if not sql_lower.strip().startswith('select'):
        return False, "Only SELECT queries are allowed"
    
    # Check for multiple statements
    if ';' in sql_query:
        return False, "Multiple SQL statements are not allowed"
    
    # Check for JOIN operations
    if re.search(r'\bjoin\b', sql_query, re.IGNORECASE):
        return False, "JOIN operations are not permitted"
    
    # Check for wildcard selects
    if re.search(r'select\s+\*', sql_query, re.IGNORECASE):
        return False, "Wildcard (*) selects are not allowed. Please specify column names explicitly."
    
    # Limit the tables that can be queried to only the battery_data table
    allowed_tables = ['battery_data']
    table_pattern = r'\bfrom\s+([a-zA-Z0-9_]+)'
    tables = re.findall(table_pattern, sql_query, re.IGNORECASE)
    
    for table in tables:
        if table.lower() not in [t.lower() for t in allowed_tables]:
            return False, f"Access to table '{table}' is not allowed"
    
    return True, sql_query

def optimize_sql_query(sql_query):
    """Optimize the SQL query for better performance.
    
    Args:
        sql_query (str): The SQL query to optimize.
        
    Returns:
        str: Optimized SQL query.
    """
    # Convert to lowercase for pattern matching but keep original for modifications
    sql_lower = sql_query.lower()
    
    # Ensure LIMIT is applied to prevent excessive data retrieval
    if 'limit' not in sql_lower:
        # If there's already a semicolon at the end, insert before it
        if sql_query.rstrip().endswith(';'):
            sql_query = sql_query.rstrip()[:-1] + " LIMIT 1000;"
        else:
            sql_query = sql_query + " LIMIT 1000"
    
    # Add query hints for PostgreSQL if appropriate
    # For example, if we're doing a full table scan and we know there's an index
    if 'where' in sql_lower and 'continent' in sql_lower:
        # Add index hint for continent if it's in a WHERE clause
        sql_query = sql_query.replace("FROM battery_data", 
                                     "FROM battery_data /*+ IndexScan(battery_data idx_location) */")
    
    # Ensure proper ordering for better performance
    if 'order by' not in sql_lower:
        # If there's a GROUP BY clause, add ORDER BY after it
        if 'group by' in sql_lower:
            group_by_match = re.search(r'(group by[^;]*)', sql_lower)
            if group_by_match:
                group_by_clause = group_by_match.group(1)
                columns = re.findall(r'group by\s+([^;\s]+)', group_by_clause)
                if columns:
                    # Insert ORDER BY after GROUP BY
                    order_by_clause = f" ORDER BY {columns[0]}"
                    # Find where to insert the ORDER BY clause
                    if 'limit' in sql_lower:
                        # Insert before LIMIT
                        limit_pos = sql_lower.find('limit')
                        sql_query = sql_query[:limit_pos] + order_by_clause + " " + sql_query[limit_pos:]
                    else:
                        # Append at the end
                        sql_query += order_by_clause
    
    return sql_query

def audit_query(query_text, sql_query, user_ip):
    """Log query information for auditing purposes.
    
    Args:
        query_text (str): The original natural language query.
        sql_query (str): The generated SQL query.
        user_ip (str): The IP address of the user making the request.
    """
    try:
        # Create logs directory if it doesn't exist
        log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # Create a structured log entry with more information
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = {
            "timestamp": timestamp,
            "user_ip": user_ip,
            "query_text": query_text,
            "sql_query": sql_query,
            "user_agent": request.headers.get('User-Agent', 'Unknown'),
            "request_id": request.headers.get('X-Request-ID', str(uuid.uuid4())),
            "is_valid": validate_sql_query(sql_query)[0]
        }
        
        # Write to JSON log file
        log_file = os.path.join(log_dir, 'ai_query_audit.log')
        with open(log_file, 'a') as f:
            f.write(json.dumps(log_entry) + "\n")
            
        # Also log to application logger for centralized logging
        current_app.logger.info(f"AI Query: {user_ip} | {query_text[:50]}... | Valid: {log_entry['is_valid']}")
        
        # If query is suspicious, log a warning
        if not log_entry['is_valid'] or any(pattern in query_text.lower() for pattern in ['drop', 'delete', 'truncate', 'insert']):
            current_app.logger.warning(f"Suspicious AI query detected: {user_ip} | {query_text}")
            
    except Exception as e:
        current_app.logger.error(f"Error writing to audit log: {str(e)}")
        # Don't let audit failures affect the main functionality
        pass

@ai_query_routes.route('/ai-query', methods=['POST'])
def handle_ai_query():
    """Handle AI-powered natural language to SQL query conversion.
    
    This endpoint accepts a natural language query, converts it to SQL using OpenAI,
    validates the SQL for security, and executes it against the database.
    
    Request JSON format:
        {
            "query": "Natural language query string"
        }
    
    Returns:
        JSON response with query results or error message
    """
    try:
        # Check if request has JSON content
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
            
        # Get client IP for rate limiting and auditing
        client_ip = request.remote_addr
        
        # Get the query from the request
        data = request.get_json()
        query_text = data.get('query')
        
        if not query_text:
            return jsonify({'error': 'Missing query parameter'}), 400
        
        # Check for obvious malicious queries before even sending to OpenAI
        dangerous_keywords = ['drop', 'delete', 'truncate', 'insert', 'update', 'alter', 'create']
        if any(keyword in query_text.lower() for keyword in dangerous_keywords):
            # Audit the suspicious query
            audit_query(query_text, "", client_ip)
            return jsonify({'error': 'Query contains disallowed operations'}), 400
        
        # Generate SQL from natural language
        try:
            sql_query = generate_sql_from_natural_language(query_text)
        except Exception as e:
            current_app.logger.error(f"SQL generation error: {str(e)}")
            return jsonify({'error': f'Failed to generate SQL query: {str(e)}'}), 400
            
        # Validate the generated SQL
        is_valid, validation_msg = validate_sql_query(sql_query)
        
        # Audit the query regardless of validity
        audit_query(query_text, sql_query, client_ip)
        
        if not is_valid:
            return jsonify({'error': validation_msg}), 400
        
        # Optimize the validated query
        sql_query = optimize_sql_query(sql_query)
        
        # Execute the validated and optimized query
        with db_session() as session:
            try:
                # Set a statement timeout for PostgreSQL
                if 'postgresql' in str(session.bind.engine.url):
                    session.execute(text("SET statement_timeout = 5000;"))  # 5 seconds timeout
                
                # Execute the query with a timeout
                result = session.execute(text(sql_query)).fetchall()
                
                # Format the results
                formatted_results = [dict(row) for row in result]
                
                # Add metadata to the response
                execution_time = datetime.now(timezone.utc).isoformat()
                response = {
                    'data': formatted_results,
                    'metadata': {
                        'row_count': len(formatted_results),
                        'sql_query': sql_query,
                        'execution_time': execution_time
                    }
                }
                
                return jsonify(response)
            except Exception as e:
                current_app.logger.error(f"SQL execution error: {str(e)}")
                return jsonify({'error': f'Failed to execute query: {str(e)}'}), 400

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"AI query error: {str(e)}")
        return jsonify({'error': 'Failed to process query'}), 500