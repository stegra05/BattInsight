"""
AI query routes for BattInsight API.
"""
import os
import json
import logging
import uuid
from datetime import datetime, timezone
import re
from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from backend.core.database import get_db_session
from backend.services.ai_service import generate_sql_from_natural_language, validate_sql_query, optimize_sql_query

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
ai_query_routes = Blueprint('ai_query_routes', __name__)

@ai_query_routes.route('', methods=['POST'])
def ai_query():
    """Handle AI-powered natural language to SQL query conversion.
    
    This endpoint accepts a natural language query, converts it to SQL using OpenAI,
    validates the SQL for security, and executes it against the database.
    
    Request JSON format:
        {
            "query": "Natural language query string",
            "options": {
                "max_results": 100,
                "include_metadata": true
            }
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
        options = data.get('options', {})
        max_results = options.get('max_results', 100)
        include_metadata = options.get('include_metadata', True)
        
        if not query_text:
            return jsonify({'error': 'Missing query parameter'}), 400
        
        # Check for obvious malicious queries before even sending to OpenAI
        dangerous_keywords = ['drop', 'delete', 'truncate', 'insert', 'update', 'alter', 'create']
        if any(keyword in query_text.lower() for keyword in dangerous_keywords):
            # Audit the suspicious query
            audit_query(query_text, "", client_ip, False)
            return jsonify({'error': 'Query contains disallowed operations'}), 400
        
        # Generate SQL from natural language
        try:
            sql_query = generate_sql_from_natural_language(query_text)
        except Exception as e:
            logger.error(f"SQL generation error: {str(e)}")
            return jsonify({'error': f'Failed to generate SQL query: {str(e)}'}), 400
            
        # Validate the generated SQL
        is_valid, validation_msg = validate_sql_query(sql_query)
        
        # Audit the query regardless of validity
        audit_query(query_text, sql_query, client_ip, is_valid)
        
        if not is_valid:
            return jsonify({'error': validation_msg}), 400
        
        # Optimize the validated query
        sql_query = optimize_sql_query(sql_query, max_results)
        
        # Execute the validated and optimized query
        with get_db_session() as session:
            try:
                # Set a statement timeout for PostgreSQL
                if 'postgresql' in str(session.bind.engine.url):
                    session.execute(text("SET statement_timeout = 10000;"))  # 10 seconds timeout
                
                # Execute the query with a timeout
                result = session.execute(text(sql_query)).fetchall()
                
                # Format the results
                formatted_results = [dict(row) for row in result]
                
                # Add metadata to the response
                execution_time = datetime.now(timezone.utc).isoformat()
                response = {
                    'data': formatted_results,
                }
                
                if include_metadata:
                    response['metadata'] = {
                        'row_count': len(formatted_results),
                        'sql_query': sql_query,
                        'execution_time': execution_time,
                        'query_text': query_text
                    }
                
                return jsonify(response)
            except Exception as e:
                logger.error(f"SQL execution error: {str(e)}")
                return jsonify({'error': f'Failed to execute query: {str(e)}'}), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"AI query error: {str(e)}")
        return jsonify({'error': 'Failed to process query'}), 500

def audit_query(query_text, sql_query, user_ip, is_valid):
    """Audit AI query for security and compliance.
    
    Args:
        query_text: Natural language query
        sql_query: Generated SQL query
        user_ip: User IP address
        is_valid: Whether the SQL query is valid
    """
    try:
        # Create logs directory if it doesn't exist
        log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        # Create audit log entry
        timestamp = datetime.now(timezone.utc).isoformat()
        log_entry = {
            "timestamp": timestamp,
            "user_ip": user_ip,
            "query_text": query_text,
            "sql_query": sql_query,
            "user_agent": request.headers.get('User-Agent', 'Unknown'),
            "request_id": request.headers.get('X-Request-ID', str(uuid.uuid4())),
            "is_valid": is_valid
        }
        
        # Write to JSON log file
        log_file = os.path.join(log_dir, 'ai_query_audit.log')
        with open(log_file, 'a') as f:
            f.write(json.dumps(log_entry) + "\n")
            
        # Also log to application logger for centralized logging
        logger.info(f"AI Query: {user_ip} | {query_text[:50]}... | Valid: {is_valid}")
        
        # If query is suspicious, log a warning
        if not is_valid or any(pattern in query_text.lower() for pattern in ['drop', 'delete', 'truncate', 'insert']):
            logger.warning(f"Suspicious AI query detected: {user_ip} | {query_text}")
            
    except Exception as e:
        logger.error(f"Error writing to audit log: {str(e)}")
        # Don't let audit failures affect the main functionality
        pass
