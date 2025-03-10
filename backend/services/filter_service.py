"""
Filter service for BattInsight.
"""
import logging
from sqlalchemy import func, distinct
from backend.core.database import get_db_session
from backend.core.models import BatteryData, ModelSeries

# Configure logging
logger = logging.getLogger(__name__)

def get_filter_options():
    """Get filter options.
    
    Returns:
        Dictionary with filter options
    """
    try:
        with get_db_session() as session:
            # Get continents
            continents = session.query(distinct(BatteryData.continent)).filter(BatteryData.continent != None).order_by(BatteryData.continent).all()
            continents = [c[0] for c in continents if c[0]]
            
            # Get countries
            countries = session.query(distinct(BatteryData.country)).filter(BatteryData.country != None).order_by(BatteryData.country).all()
            countries = [c[0] for c in countries if c[0]]
            
            # Get climates
            climates = session.query(distinct(BatteryData.climate)).filter(BatteryData.climate != None).order_by(BatteryData.climate).all()
            climates = [c[0] for c in climates if c[0]]
            
            # Get model series
            model_series = session.query(distinct(BatteryData.model_series)).filter(BatteryData.model_series != None).order_by(BatteryData.model_series).all()
            model_series = [ms[0] for ms in model_series if ms[0] is not None]
            
            # Get variables
            variables = session.query(distinct(BatteryData.var)).filter(BatteryData.var != None).order_by(BatteryData.var).all()
            variables = [v[0] for v in variables if v[0]]
            
            return {
                'continents': continents,
                'countries': countries,
                'climates': climates,
                'model_series': model_series,
                'variables': variables
            }
    
    except Exception as e:
        logger.error(f"Error getting filter options: {str(e)}")
        raise

def apply_filters(filters):
    """Apply filters to battery data.
    
    Args:
        filters: Dictionary of filter parameters
        
    Returns:
        List of filtered data
    """
    try:
        with get_db_session() as session:
            # Start with base query
            query = session.query(BatteryData)
            
            # Apply filters
            if 'country' in filters:
                query = query.filter(BatteryData.country == filters['country'])
            
            if 'continent' in filters:
                query = query.filter(BatteryData.continent == filters['continent'])
            
            if 'climate' in filters:
                query = query.filter(BatteryData.climate == filters['climate'])
            
            if 'model_series' in filters:
                query = query.filter(BatteryData.model_series == filters['model_series'])
            
            if 'var' in filters:
                query = query.filter(BatteryData.var == filters['var'])
            
            # Handle value range filters
            if 'val_min' in filters:
                try:
                    query = query.filter(BatteryData.val >= float(filters['val_min']))
                except (ValueError, TypeError):
                    pass
            
            if 'val_max' in filters:
                try:
                    query = query.filter(BatteryData.val <= float(filters['val_max']))
                except (ValueError, TypeError):
                    pass
            
            # Execute query
            results = query.all()
            
            # Format results
            data = []
            for item in results:
                data.append({
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
                })
            
            return data
    
    except Exception as e:
        logger.error(f"Error applying filters: {str(e)}")
        raise

def apply_list_filters(query, filter_name, filter_values):
    """Apply list filters to query.
    
    Args:
        query: SQLAlchemy query
        filter_name: Name of filter
        filter_values: List of filter values
        
    Returns:
        Filtered query
    """
    if not filter_values:
        return query
    
    if filter_name == 'continents':
        return query.filter(BatteryData.continent.in_(filter_values))
    elif filter_name == 'countries':
        return query.filter(BatteryData.country.in_(filter_values))
    elif filter_name == 'climates':
        return query.filter(BatteryData.climate.in_(filter_values))
    elif filter_name == 'model_series':
        return query.filter(BatteryData.model_series.in_(filter_values))
    elif filter_name == 'variables':
        return query.filter(BatteryData.var.in_(filter_values))
    
    return query

def apply_range_filters(query, filter_name, filter_range):
    """Apply range filters to query.
    
    Args:
        query: SQLAlchemy query
        filter_name: Name of filter
        filter_range: Dictionary with min and max values
        
    Returns:
        Filtered query
    """
    if not filter_range:
        return query
    
    if filter_name == 'value_range':
        if 'min' in filter_range and filter_range['min'] is not None:
            query = query.filter(BatteryData.val >= filter_range['min'])
        
        if 'max' in filter_range and filter_range['max'] is not None:
            query = query.filter(BatteryData.val <= filter_range['max'])
    
    elif filter_name == 'vehicle_count_range':
        if 'min' in filter_range and filter_range['min'] is not None:
            query = query.filter(BatteryData.cnt_vhcl >= filter_range['min'])
        
        if 'max' in filter_range and filter_range['max'] is not None:
            query = query.filter(BatteryData.cnt_vhcl <= filter_range['max'])
    
    return query
