"""Filter application endpoints.

This module provides endpoints for applying complex filters to battery data.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from ..database import db_session
from .utils import handle_db_error, handle_general_error, validate_pagination_params

# Create a Blueprint for filter application routes
filter_apply_bp = Blueprint('filter_apply', __name__)


@filter_apply_bp.route('/', methods=['POST'])
def apply_filters():
    """Apply multiple filters to the battery data.
    
    Request body:
        JSON with filter criteria
        {
            "filters": {
                "continent": ["Europe", "Asia"],
                "climate": ["temperate"],
                "model_series": [1, 2],
                "val_range": {"min": 0, "max": 100},
                "cnt_vhcl_range": {"min": 10, "max": 1000}
            },
            "page": 1,
            "per_page": 50
        }
    
    Returns:
        JSON response with filtered data and pagination info
    """
    try:
        # Import BatteryData here to avoid circular imports
        from models import BatteryData
        
        # Get request data
        request_data = request.get_json()
        
        if not request_data or 'filters' not in request_data:
            return jsonify({'error': 'No filters provided'}), 400
        
        # Validate input JSON structure
        if not isinstance(request_data.get('filters', {}), dict):
            return jsonify({'error': 'Invalid filter format'}), 400
        
        filters = request_data['filters']
        
        # Validate page and per_page parameters
        try:
            page, per_page = validate_pagination_params(
                request_data.get('page'), 
                request_data.get('per_page')
            )
        except ValueError:
            return jsonify({'error': 'Invalid pagination parameters'}), 400
        
        # Limit maximum filter values
        MAX_FILTER_VALUES = 50
        for filter_type, values in filters.items():
            if isinstance(values, list) and len(values) > MAX_FILTER_VALUES:
                return jsonify({'error': f'Too many values for {filter_type} filter (max {MAX_FILTER_VALUES})'}), 400
        
        # Start building the query
        with db_session() as session:
            query = session.query(BatteryData)
            
            # Apply filters with validation
            query = apply_list_filters(query, filters, BatteryData)
            query = apply_range_filters(query, filters, BatteryData)
            
            # Apply execution timeout to prevent long-running queries
            query = query.execution_options(statement_timeout=15000)
            
            # Get total count for pagination
            total_count = query.count()
            
            # Apply pagination
            results = query.offset((page - 1) * per_page).limit(per_page).all()
            
            # Convert results to dictionary
            data = format_results(results)
            
            # Calculate pagination info
            total_pages = (total_count + per_page - 1) // per_page  # Ceiling division
            
            return jsonify({
                'data': data,
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total_count': total_count,
                    'total_pages': total_pages
                }
            })
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "apply_filters")
    except Exception as e:
        return handle_general_error(e, "apply_filters")


def apply_list_filters(query, filters, BatteryData):
    """Apply list-type filters to the query.
    
    Args:
        query: SQLAlchemy query object
        filters: Dictionary of filters
        BatteryData: The BatteryData model class
        
    Returns:
        Updated query object
    """
    # Apply simple list filters
    list_filters = [
        ('batt_alias', BatteryData.batt_alias),
        ('country', BatteryData.country),
        ('continent', BatteryData.continent),
        ('climate', BatteryData.climate),
        ('iso_a3', BatteryData.iso_a3),
        ('model_series', BatteryData.model_series),
        ('var', BatteryData.var)
    ]
    
    for filter_name, filter_column in list_filters:
        if filter_name in filters and filters[filter_name]:
            if not isinstance(filters[filter_name], list):
                raise ValueError(f"{filter_name} filter must be a list")
            query = query.filter(filter_column.in_(filters[filter_name]))
    
    return query


def apply_range_filters(query, filters, BatteryData):
    """Apply range-type filters to the query.
    
    Args:
        query: SQLAlchemy query object
        filters: Dictionary of filters
        BatteryData: The BatteryData model class
        
    Returns:
        Updated query object
    """
    # Apply val_range filter
    if 'val_range' in filters and filters['val_range']:
        if not isinstance(filters['val_range'], dict):
            raise ValueError("val_range filter must be an object with min and max properties")
        
        if 'min' in filters['val_range'] and filters['val_range']['min'] is not None:
            try:
                min_val = float(filters['val_range']['min'])
                query = query.filter(BatteryData.val >= min_val)
            except (ValueError, TypeError):
                raise ValueError("Invalid min value in val_range filter")
        
        if 'max' in filters['val_range'] and filters['val_range']['max'] is not None:
            try:
                max_val = float(filters['val_range']['max'])
                query = query.filter(BatteryData.val <= max_val)
            except (ValueError, TypeError):
                raise ValueError("Invalid max value in val_range filter")
    
    # Apply cnt_vhcl_range filter
    if 'cnt_vhcl_range' in filters and filters['cnt_vhcl_range']:
        if not isinstance(filters['cnt_vhcl_range'], dict):
            raise ValueError("cnt_vhcl_range filter must be an object with min and max properties")
        
        if 'min' in filters['cnt_vhcl_range'] and filters['cnt_vhcl_range']['min'] is not None:
            try:
                min_cnt = int(filters['cnt_vhcl_range']['min'])
                query = query.filter(BatteryData.cnt_vhcl >= min_cnt)
            except (ValueError, TypeError):
                raise ValueError("Invalid min value in cnt_vhcl_range filter")
        
        if 'max' in filters['cnt_vhcl_range'] and filters['cnt_vhcl_range']['max'] is not None:
            try:
                max_cnt = int(filters['cnt_vhcl_range']['max'])
                query = query.filter(BatteryData.cnt_vhcl <= max_cnt)
            except (ValueError, TypeError):
                raise ValueError("Invalid max value in cnt_vhcl_range filter")
    
    return query


def format_results(results):
    """Format query results into a dictionary.
    
    Args:
        results: SQLAlchemy query results
        
    Returns:
        List of dictionaries with formatted data
    """
    return [{
        'id': item.id,
        'batt_alias': item.batt_alias,
        'country': item.country,
        'continent': item.continent,
        'climate': item.climate,
        'iso_a3': item.iso_a3,
        'model_series': item.model_series,
        'var': item.var,
        'val': item.val,
        'descr': item.descr,
        'cnt_vhcl': item.cnt_vhcl
    } for item in results]