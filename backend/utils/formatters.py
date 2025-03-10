"""
Utility functions for formatting data in BattInsight.
"""
import json
import logging
from datetime import datetime, date

# Configure logging
logger = logging.getLogger(__name__)

def format_date(date_obj, format_str='%Y-%m-%d'):
    """Format date object to string.
    
    Args:
        date_obj: Date object to format
        format_str: Format string
        
    Returns:
        Formatted date string
    """
    if isinstance(date_obj, datetime):
        return date_obj.strftime(format_str)
    elif isinstance(date_obj, date):
        return date_obj.strftime(format_str)
    elif isinstance(date_obj, str):
        try:
            return datetime.strptime(date_obj, '%Y-%m-%d').strftime(format_str)
        except ValueError:
            return date_obj
    return None

def format_number(number, decimal_places=2):
    """Format number with specified decimal places.
    
    Args:
        number: Number to format
        decimal_places: Number of decimal places
        
    Returns:
        Formatted number string
    """
    try:
        return f"{float(number):.{decimal_places}f}"
    except (ValueError, TypeError):
        return str(number)

def format_percentage(number, decimal_places=1):
    """Format number as percentage.
    
    Args:
        number: Number to format
        decimal_places: Number of decimal places
        
    Returns:
        Formatted percentage string
    """
    try:
        return f"{float(number) * 100:.{decimal_places}f}%"
    except (ValueError, TypeError):
        return str(number)

def format_currency(number, currency='$', decimal_places=2):
    """Format number as currency.
    
    Args:
        number: Number to format
        currency: Currency symbol
        decimal_places: Number of decimal places
        
    Returns:
        Formatted currency string
    """
    try:
        return f"{currency}{float(number):.{decimal_places}f}"
    except (ValueError, TypeError):
        return str(number)

def format_json(data, indent=2):
    """Format data as JSON string.
    
    Args:
        data: Data to format
        indent: Indentation level
        
    Returns:
        Formatted JSON string
    """
    try:
        return json.dumps(data, indent=indent)
    except Exception as e:
        logger.error(f"Error formatting JSON: {str(e)}")
        return str(data)

def format_list(items, separator=', '):
    """Format list as string.
    
    Args:
        items: List of items
        separator: Separator string
        
    Returns:
        Formatted list string
    """
    if not items:
        return ''
    
    return separator.join(str(item) for item in items)

def format_model_to_dict(model):
    """Format SQLAlchemy model to dictionary.
    
    Args:
        model: SQLAlchemy model instance
        
    Returns:
        Dictionary representation of model
    """
    if not model:
        return {}
    
    result = {}
    for column in model.__table__.columns:
        value = getattr(model, column.name)
        if isinstance(value, (datetime, date)):
            value = format_date(value)
        result[column.name] = value
    
    return result
