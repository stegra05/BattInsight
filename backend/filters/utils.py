"""Ziel & Funktion:
	•	Stellt Hilfsfunktionen für die Filtermodule bereit.
	•	Implementiert gemeinsam genutzte Funktionalitäten wie Fehlerbehandlung und Caching.
Abhängigkeiten:
	•	Wird von den anderen Filtermodulen verwendet.
"""

from flask import jsonify, current_app
from functools import wraps
from sqlalchemy.exc import SQLAlchemyError
from database import db_session
from models import BatteryData


def create_cached_response(data, cache_time=3600):
    """Create a response with cache control headers.
    
    Args:
        data: The data to include in the response
        cache_time: Cache time in seconds (default: 3600)
        
    Returns:
        Flask response with cache headers
    """
    response = jsonify(data)
    response.headers.set('Cache-Control', f'public, max-age={cache_time}')
    return response


def handle_db_error(e, function_name):
    """Handle database errors with proper logging.
    
    Args:
        e: The exception that was raised
        function_name: Name of the function where the error occurred
        
    Returns:
        Tuple of (response, status_code)
    """
    current_app.logger.error(f"Database error in {function_name}: {str(e)}")
    return jsonify({'error': 'Database operation failed'}), 500


def handle_general_error(e, function_name):
    """Handle general exceptions with proper logging.
    
    Args:
        e: The exception that was raised
        function_name: Name of the function where the error occurred
        
    Returns:
        Tuple of (response, status_code)
    """
    current_app.logger.error(f"Unexpected error in {function_name}: {str(e)}")
    return jsonify({'error': 'Internal server error'}), 500


def validate_pagination_params(page, per_page, max_per_page=1000):
    """Validate and normalize pagination parameters.
    
    Args:
        page: The requested page number
        per_page: The requested items per page
        max_per_page: Maximum allowed items per page
        
    Returns:
        Tuple of (page, per_page) with normalized values
        
    Raises:
        ValueError: If parameters are invalid
    """
    try:
        page = int(page) if page is not None else 1
        per_page = int(per_page) if per_page is not None else 100
        
        if page < 1:
            page = 1
        if per_page < 1:
            per_page = 100
        if per_page > max_per_page:
            per_page = max_per_page
            
        return page, per_page
    except (ValueError, TypeError):
        raise ValueError("Invalid pagination parameters")


def validate_filter_list(filter_value, filter_name):
    """Validate that a filter value is a list.
    
    Args:
        filter_value: The filter value to validate
        filter_name: Name of the filter for error messages
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If filter is not a list
    """
    if not isinstance(filter_value, list):
        raise ValueError(f"{filter_name} filter must be a list")
    return True


def validate_filter_range(range_value, range_name):
    """Validate that a range filter is properly formatted.
    
    Args:
        range_value: The range value to validate
        range_name: Name of the range for error messages
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If range is not properly formatted
    """
    if not isinstance(range_value, dict):
        raise ValueError(f"{range_name} filter must be an object with min and max properties")
    return True


def validate_range_value(value, value_type, range_name, bound_type):
    """Validate a specific range bound value.
    
    Args:
        value: The value to validate
        value_type: Type to convert to (float or int)
        range_name: Name of the range for error messages
        bound_type: Type of bound (min or max)
        
    Returns:
        Converted value
        
    Raises:
        ValueError: If value is invalid
    """
    try:
        return value_type(value)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid {bound_type} value in {range_name} filter")