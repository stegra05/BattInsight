"""
Security utility functions for BattInsight.
"""
import os
import re
import logging
import hashlib
import secrets
import base64
from datetime import datetime, timedelta

# Configure logging
logger = logging.getLogger(__name__)

def generate_secure_token(length=32):
    """Generate a secure random token.
    
    Args:
        length: Length of token in bytes
        
    Returns:
        Secure random token as hexadecimal string
    """
    return secrets.token_hex(length)

def hash_password(password, salt=None):
    """Hash password using SHA-256.
    
    Args:
        password: Password to hash
        salt: Salt for hashing (optional)
        
    Returns:
        Tuple of (hashed_password, salt)
    """
    if not salt:
        salt = os.urandom(32)
    
    # Convert password to bytes if it's a string
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    # Hash password with salt
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password,
        salt,
        100000
    )
    
    return base64.b64encode(hashed).decode('utf-8'), base64.b64encode(salt).decode('utf-8')

def verify_password(password, hashed_password, salt):
    """Verify password against hashed password.
    
    Args:
        password: Password to verify
        hashed_password: Hashed password
        salt: Salt used for hashing
        
    Returns:
        Boolean indicating if password is correct
    """
    # Convert password to bytes if it's a string
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    # Decode salt from base64
    salt = base64.b64decode(salt)
    
    # Hash password with salt
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password,
        salt,
        100000
    )
    
    # Compare hashed passwords
    return base64.b64encode(hashed).decode('utf-8') == hashed_password

def sanitize_sql(sql):
    """Sanitize SQL query to prevent SQL injection.
    
    Args:
        sql: SQL query to sanitize
        
    Returns:
        Sanitized SQL query
    """
    # Remove comments
    sql = re.sub(r'--.*$', '', sql)
    sql = re.sub(r'/\*.*?\*/', '', sql, flags=re.DOTALL)
    
    # Check for multiple statements
    if ';' in sql and not sql.strip().endswith(';'):
        sql = sql.split(';')[0] + ';'
    
    # Check for destructive operations
    destructive_operations = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT', 'CREATE']
    for operation in destructive_operations:
        pattern = r'\b' + operation + r'\b'
        if re.search(pattern, sql, re.IGNORECASE):
            logger.warning(f"Potentially harmful SQL operation detected: {operation}")
            return None
    
    return sql

def generate_expiring_token(user_id, expiry_hours=24):
    """Generate an expiring token for user authentication.
    
    Args:
        user_id: User ID
        expiry_hours: Token expiry in hours
        
    Returns:
        Dictionary with token and expiry
    """
    # Generate random token
    token = generate_secure_token()
    
    # Calculate expiry time
    expiry = datetime.now() + timedelta(hours=expiry_hours)
    
    return {
        'token': token,
        'user_id': user_id,
        'expiry': expiry.isoformat()
    }

def is_token_valid(token_data):
    """Check if token is valid and not expired.
    
    Args:
        token_data: Token data dictionary
        
    Returns:
        Boolean indicating if token is valid
    """
    if not token_data or 'expiry' not in token_data:
        return False
    
    try:
        # Parse expiry time
        expiry = datetime.fromisoformat(token_data['expiry'])
        
        # Check if token is expired
        return datetime.now() < expiry
    except (ValueError, TypeError):
        return False
