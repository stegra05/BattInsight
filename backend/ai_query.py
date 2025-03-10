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
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError
from .database import db_session
from .models import BatteryData

# Create a Blueprint for AI query routes
ai_query_routes = Blueprint('ai_query_routes', __name__)

# Initialize OpenAI client
def get_openai_client():
    """Initialize and return the OpenAI client with API key from environment."""
    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OpenAI API key is not set in the environment variables")
    
    # Initialize the client with the API key
    client = openai.OpenAI(api_key=api_key)
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
        r'\bexec\b', r'\bexecute\b', r'--', r';\s*\w', r'xp_cmdshell'
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, sql_query, re.IGNORECASE):
            return False, f"Dangerous SQL operation detected: {pattern}"
    
    # Ensure the query is a SELECT statement
    if not sql_lower.strip().startswith('select'):
        return False, "Only SELECT queries are allowed"
    
    # Check for JOIN operations
    if re.search(r'\bjoin\b', sql_query, re.IGNORECASE):
        return False, "JOIN operations are not permitted"
    
    # Check for wildcard selects
    if re.search(r'select\s+\*', sql_lower):
        return False, "Wildcard selects are not allowed. Specify columns explicitly."
    
    # Ensure the query only accesses the battery_data table
    tables = re.findall(r'\bfrom\s+([\w_]+)\b', sql_lower)
    for table in tables:
        if table != 'battery_data':
            return False, f"Access to table '{table}' is not allowed"
    
    # Limit the number of results to prevent excessive data retrieval
    if 'limit' not in sql_lower:
        sql_query += " LIMIT 1000"
    
    return True, sql_query

def optimize_sql_query(sql_query):
    """Optimize the SQL query for better performance.
    
    Args:
        sql_query (str): The SQL query to optimize.
        
    Returns:
        str: Optimized SQL query.
    """
    # Add appropriate indexes if they're not being used
    # This is a simplified example - in a real system, you might analyze the query plan
    
    # Ensure proper ordering for better performance
    if 'order by' not in sql_query.lower():
        # If there's a GROUP BY clause, add ORDER BY after it
        if 'group by' in sql_query.lower():
            group_by_match = re.search(r'(group by[^;]*)', sql_query.lower())
            if group_by_match:
                group_by_clause = group_by_match.group(1)
                columns = re.findall(r'group by\s+([^;\s]+)', group_by_clause.lower())
                if columns:
                    # Insert ORDER BY after GROUP BY
                    sql_query = re.sub(
                        r'(group by[^;]*)', 
                        f"\\1 ORDER BY {columns[0]}", 
                        sql_query, 
                        flags=re.IGNORECASE
                    )
    
    # Add query timeout to prevent long-running queries (MySQL syntax)
    if '/*+ max_execution_time' not in sql_query.lower():
        sql_query = f"SELECT /*+ MAX_EXECUTION_TIME(5000) */ " + sql_query[7:]
    
    return sql_query

def audit_query(query_text, sql_query, user_ip):
    """Log query information for auditing purposes.
    
    Args:
        query_text (str): The original natural language query.
        sql_query (str): The generated SQL query.
        user_ip (str): The IP address of the user making the request.
    """
    try:
        log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
            
        log_file = os.path.join(log_dir, 'ai_query_audit.log')
        with open(log_file, 'a') as f:
            f.write(f"{datetime.now()} | {user_ip} | {query_text} | {sql_query}\n")
    except Exception as e:
        current_app.logger.error(f"Error writing to audit log: {str(e)}")

@ai_query_routes.route('/ai-query', methods=['POST'])
def handle_ai_query():
    try:
        data = request.get_json()
        query_text = data.get('query')
        
        if not query_text:
            return jsonify({'error': 'Missing query parameter'}), 400
        
        # Generate and validate SQL
        sql_query = generate_sql_from_natural_language(query_text)
        is_valid, validation_msg = validate_sql_query(sql_query)
        
        if not is_valid:
            return jsonify({'error': validation_msg}), 400
        
        # Execute validated query
        result = db_session.execute(sql_query).fetchall()
        return jsonify({'data': [dict(row) for row in result]})

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"AI query error: {str(e)}")
        return jsonify({'error': 'Failed to process query'}), 500