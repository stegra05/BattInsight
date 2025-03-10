"""
AI service for BattInsight.
"""
import os
import re
import logging
import openai
from flask import current_app

# Configure logging
logger = logging.getLogger(__name__)

# SQL injection patterns to check
SQL_INJECTION_PATTERNS = [
    r';\s*DROP\s+TABLE',
    r';\s*DELETE\s+FROM',
    r';\s*TRUNCATE\s+TABLE',
    r';\s*ALTER\s+TABLE',
    r';\s*UPDATE\s+.*\s+SET',
    r'UNION\s+SELECT',
    r'--',
    r'/\*.*\*/',
    r'xp_cmdshell',
    r'exec\s+master\.dbo',
    r'INTO\s+OUTFILE',
    r'LOAD_FILE'
]

# Allowed tables for AI queries
ALLOWED_TABLES = ['battery_data', 'model_series']

# System prompt for AI query generation
SYSTEM_PROMPT = """
You are an AI assistant that converts natural language queries into SQL queries for a battery data analysis system.

Database Schema:
- battery_data table:
  - id: Primary key
  - batt_alias: Battery identifier (string)
  - country: Country name (string)
  - continent: Continent name (string)
  - climate: Climate type (string)
  - iso_a3: ISO 3166-1 alpha-3 country code (string)
  - model_series: Model series identifier (integer)
  - var: Variable name (string)
  - val: Numerical value (float)
  - descr: Description (string)
  - cnt_vhcl: Vehicle count (integer)

- model_series table:
  - id: Primary key
  - series_name: Name of the series (string)
  - release_year: Year of release (integer)
  - description: Description (string)

Rules:
1. Generate only valid PostgreSQL queries
2. Only use the tables and columns mentioned above
3. Do not use any destructive operations (INSERT, UPDATE, DELETE, DROP, etc.)
4. Only generate SELECT queries
5. Include appropriate JOINs when needed
6. Use proper SQL syntax with semicolons at the end
7. Add comments to explain complex parts of the query
8. Limit results to 100 rows by default unless specified otherwise
9. Use aliases for readability when appropriate
10. Format the SQL query for readability

Return only the SQL query without any explanations or additional text.
"""

def generate_sql_from_natural_language(query_text):
    """Generate SQL from natural language using OpenAI API.
    
    Args:
        query_text: Natural language query
        
    Returns:
        Generated SQL query
    """
    # Get OpenAI API key from environment
    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OpenAI API key not found in configuration")
    
    openai.api_key = api_key
    
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query_text}
            ],
            temperature=0.1,
            max_tokens=500
        )
        
        # Extract SQL query from response
        sql_query = response.choices[0].message.content.strip()
        
        # Clean up the SQL query
        sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
        
        return sql_query
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise ValueError(f"Failed to generate SQL query: {str(e)}")

def validate_sql_query(sql_query):
    """Validate SQL query for security.
    
    Args:
        sql_query: SQL query to validate
        
    Returns:
        Tuple of (is_valid, message)
    """
    # Check if query is empty
    if not sql_query:
        return False, "Empty SQL query"
    
    # Check if query is a SELECT query
    if not sql_query.strip().lower().startswith('select'):
        return False, "Only SELECT queries are allowed"
    
    # Check for SQL injection patterns
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, sql_query, re.IGNORECASE):
            return False, f"SQL query contains potentially harmful pattern: {pattern}"
    
    # Check if query uses only allowed tables
    for table in ALLOWED_TABLES:
        if table not in sql_query.lower():
            continue
        
        # Check if the table is used in a FROM or JOIN clause
        table_pattern = r'(from|join)\s+' + table
        if not re.search(table_pattern, sql_query.lower()):
            return False, f"Invalid usage of table: {table}"
    
    # Check for destructive operations
    destructive_operations = ['insert', 'update', 'delete', 'drop', 'alter', 'truncate', 'create']
    for operation in destructive_operations:
        if re.search(r'\b' + operation + r'\b', sql_query.lower()):
            return False, f"Destructive operation not allowed: {operation}"
    
    return True, "SQL query is valid"

def optimize_sql_query(sql_query, max_results=100):
    """Optimize SQL query for performance.
    
    Args:
        sql_query: SQL query to optimize
        max_results: Maximum number of results to return
        
    Returns:
        Optimized SQL query
    """
    # Remove any existing LIMIT clause
    sql_query = re.sub(r'\bLIMIT\s+\d+\s*;?', '', sql_query, flags=re.IGNORECASE)
    
    # Add LIMIT clause if not present
    if not re.search(r'\bLIMIT\s+\d+', sql_query, re.IGNORECASE):
        sql_query = sql_query.rstrip(';') + f" LIMIT {max_results};"
    
    # Ensure query ends with semicolon
    if not sql_query.rstrip().endswith(';'):
        sql_query += ';'
    
    return sql_query
