"""
Utility functions for validation in BattInsight.
"""
import re
import logging

# Configure logging
logger = logging.getLogger(__name__)

def validate_iso_a3(iso_a3):
    """Validate ISO A3 country code.
    
    Args:
        iso_a3: ISO A3 country code
        
    Returns:
        Boolean indicating if the code is valid
    """
    if not iso_a3:
        return False
    
    # Check if it's a 3-character string
    if not isinstance(iso_a3, str) or len(iso_a3) != 3:
        return False
    
    # Check if it contains only uppercase letters
    if not re.match(r'^[A-Z]{3}$', iso_a3):
        return False
    
    return True

def validate_numeric_range(value, min_value=None, max_value=None):
    """Validate if a numeric value is within a specified range.
    
    Args:
        value: Numeric value to validate
        min_value: Minimum allowed value (optional)
        max_value: Maximum allowed value (optional)
        
    Returns:
        Boolean indicating if the value is valid
    """
    try:
        # Convert to float
        value = float(value)
        
        # Check minimum value
        if min_value is not None and value < min_value:
            return False
        
        # Check maximum value
        if max_value is not None and value > max_value:
            return False
        
        return True
    except (ValueError, TypeError):
        return False

def validate_string_length(string, min_length=None, max_length=None):
    """Validate if a string's length is within a specified range.
    
    Args:
        string: String to validate
        min_length: Minimum allowed length (optional)
        max_length: Maximum allowed length (optional)
        
    Returns:
        Boolean indicating if the string is valid
    """
    if not isinstance(string, str):
        return False
    
    # Check minimum length
    if min_length is not None and len(string) < min_length:
        return False
    
    # Check maximum length
    if max_length is not None and len(string) > max_length:
        return False
    
    return True

def sanitize_input(input_string):
    """Sanitize input string to prevent SQL injection.
    
    Args:
        input_string: Input string to sanitize
        
    Returns:
        Sanitized string
    """
    if not input_string:
        return input_string
    
    # Remove SQL comment markers
    sanitized = re.sub(r'--.*$', '', input_string)
    sanitized = re.sub(r'/\*.*?\*/', '', sanitized, flags=re.DOTALL)
    
    # Remove SQL keywords
    sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE']
    pattern = r'\b(' + '|'.join(sql_keywords) + r')\b'
    sanitized = re.sub(pattern, '', sanitized, flags=re.IGNORECASE)
    
    # Remove semicolons
    sanitized = sanitized.replace(';', '')
    
    # Remove quotes
    sanitized = sanitized.replace("'", "").replace('"', '')
    
    return sanitized.strip()
