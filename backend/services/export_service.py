"""
Export service for BattInsight.
"""
import logging
from backend.core.database import get_db_session
from backend.core.models import BatteryData

# Configure logging
logger = logging.getLogger(__name__)

def get_filtered_data(filters, session=None):
    """Get filtered data from database.
    
    Args:
        filters: Dictionary of filter parameters
        session: Optional database session (for testing)
        
    Returns:
        Tuple of (query, data)
    """
    try:
        # Use provided session or create a new one
        if session:
            # Start with base query
            query = session.query(BatteryData)
            
            # Apply filters
            query = apply_filters_to_query(query, filters)
            
            # Execute query
            data = query.all()
            
            return query, data
        else:
            with get_db_session() as session:
                # Start with base query
                query = session.query(BatteryData)
                
                # Apply filters
                query = apply_filters_to_query(query, filters)
                
                # Execute query
                data = query.all()
                
                return query, data
    
    except Exception as e:
        logger.error(f"Error getting filtered data: {str(e)}")
        raise

def apply_filters_to_query(query, filters):
    """Apply filters to query.
    
    Args:
        query: SQLAlchemy query
        filters: Dictionary of filter parameters
        
    Returns:
        Filtered query
    """
    # Apply filters
    if 'batt_alias' in filters:
        query = query.filter(BatteryData.batt_alias == filters['batt_alias'])
    
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
    
    # Handle vehicle count range filters
    if 'cnt_vhcl_min' in filters:
        try:
            query = query.filter(BatteryData.cnt_vhcl >= int(filters['cnt_vhcl_min']))
        except (ValueError, TypeError):
            pass
    
    if 'cnt_vhcl_max' in filters:
        try:
            query = query.filter(BatteryData.cnt_vhcl <= int(filters['cnt_vhcl_max']))
        except (ValueError, TypeError):
            pass
    
    return query
