"""
Filter routes for BattInsight API.
"""
import logging
from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import func, distinct
from backend.core.database import get_db_session
from backend.core.models import BatteryData, ModelSeries
from backend.services.filter_service import get_filter_options, apply_filters

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
filter_routes = Blueprint('filter_routes', __name__)

@filter_routes.route('/options', methods=['GET'])
def get_options():
    """Get filter options.
    
    Returns:
        JSON response with filter options
    """
    try:
        options = get_filter_options()
        return jsonify(options)
    
    except Exception as e:
        logger.error(f"Error getting filter options: {str(e)}")
        return jsonify({'error': 'Failed to get filter options'}), 500

@filter_routes.route('/enhanced-options', methods=['GET'])
def get_enhanced_options():
    """Get enhanced filter options with additional metadata.
    
    Returns:
        JSON response with filter options and metadata
    """
    try:
        with get_db_session() as session:
            # Get continents with count
            continents_query = session.query(
                BatteryData.continent,
                func.count(distinct(BatteryData.country)).label('country_count'),
                func.count(BatteryData.id).label('record_count')
            ).group_by(BatteryData.continent).order_by(BatteryData.continent)
            
            continents = []
            for continent, country_count, record_count in continents_query:
                if continent:  # Skip None values
                    continents.append({
                        'name': continent,
                        'country_count': country_count,
                        'record_count': record_count
                    })
            
            # Get countries with continent and count
            countries_query = session.query(
                BatteryData.country,
                BatteryData.continent,
                BatteryData.iso_a3,
                func.count(BatteryData.id).label('record_count')
            ).group_by(BatteryData.country, BatteryData.continent, BatteryData.iso_a3).order_by(BatteryData.country)
            
            countries = []
            for country, continent, iso_a3, record_count in countries_query:
                if country:  # Skip None values
                    countries.append({
                        'name': country,
                        'continent': continent,
                        'iso_a3': iso_a3,
                        'record_count': record_count
                    })
            
            # Get climates with count
            climates_query = session.query(
                BatteryData.climate,
                func.count(distinct(BatteryData.country)).label('country_count'),
                func.count(BatteryData.id).label('record_count')
            ).group_by(BatteryData.climate).order_by(BatteryData.climate)
            
            climates = []
            for climate, country_count, record_count in climates_query:
                if climate:  # Skip None values
                    climates.append({
                        'name': climate,
                        'country_count': country_count,
                        'record_count': record_count
                    })
            
            # Get model series with count
            model_series_query = session.query(
                BatteryData.model_series,
                func.count(distinct(BatteryData.batt_alias)).label('battery_count'),
                func.count(BatteryData.id).label('record_count')
            ).group_by(BatteryData.model_series).order_by(BatteryData.model_series)
            
            model_series = []
            for series, battery_count, record_count in model_series_query:
                if series is not None:  # Skip None values
                    model_series.append({
                        'id': series,
                        'series_name': f"Series {series}",
                        'battery_count': battery_count,
                        'record_count': record_count
                    })
            
            # Get variables with count
            variables_query = session.query(
                BatteryData.var,
                func.count(BatteryData.id).label('record_count')
            ).group_by(BatteryData.var).order_by(BatteryData.var)
            
            variables = []
            for var, record_count in variables_query:
                if var:  # Skip None values
                    variables.append({
                        'name': var,
                        'record_count': record_count
                    })
            
            # Get value ranges
            value_ranges = session.query(
                func.min(BatteryData.val).label('min_val'),
                func.max(BatteryData.val).label('max_val'),
                func.avg(BatteryData.val).label('avg_val')
            ).first()
            
            # Get vehicle count ranges
            vehicle_count_ranges = session.query(
                func.min(BatteryData.cnt_vhcl).label('min_count'),
                func.max(BatteryData.cnt_vhcl).label('max_count'),
                func.avg(BatteryData.cnt_vhcl).label('avg_count')
            ).first()
            
            return jsonify({
                'continents': continents,
                'countries': countries,
                'climates': climates,
                'model_series': model_series,
                'variables': variables,
                'value_ranges': {
                    'min': float(value_ranges.min_val) if value_ranges.min_val is not None else 0,
                    'max': float(value_ranges.max_val) if value_ranges.max_val is not None else 0,
                    'avg': float(value_ranges.avg_val) if value_ranges.avg_val is not None else 0
                },
                'vehicle_count_ranges': {
                    'min': int(vehicle_count_ranges.min_count) if vehicle_count_ranges.min_count is not None else 0,
                    'max': int(vehicle_count_ranges.max_count) if vehicle_count_ranges.max_count is not None else 0,
                    'avg': float(vehicle_count_ranges.avg_count) if vehicle_count_ranges.avg_count is not None else 0
                }
            })
    
    except Exception as e:
        logger.error(f"Error getting enhanced filter options: {str(e)}")
        return jsonify({'error': 'Failed to get filter options'}), 500

@filter_routes.route('/apply', methods=['GET'])
def apply_filter():
    """Apply filters to battery data.
    
    Query parameters:
        Same as data endpoint filters
        
    Returns:
        JSON response with filtered data
    """
    try:
        # Get query parameters
        filters = request.args.to_dict()
        
        # Apply filters
        data = apply_filters(filters)
        
        return jsonify({'data': data})
    
    except Exception as e:
        logger.error(f"Error applying filters: {str(e)}")
        return jsonify({'error': 'Failed to apply filters'}), 500

@filter_routes.route('/apply-enhanced', methods=['POST'])
def apply_enhanced_filters():
    """Apply enhanced filters to battery data.
    
    Request JSON format:
        {
            "filters": {
                "continents": ["Europe", "Asia"],
                "countries": ["Germany", "France"],
                "climates": ["normal"],
                "model_series": [295, 296],
                "variables": ["variable_1"],
                "value_range": {
                    "min": 0,
                    "max": 100
                },
                "vehicle_count_range": {
                    "min": 0,
                    "max": 1000
                }
            },
            "pagination": {
                "page": 1,
                "per_page": 20
            },
            "sort": {
                "field": "val",
                "direction": "desc"
            }
        }
    
    Returns:
        JSON response with filtered data and pagination info
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No filter data provided'}), 400
        
        # Extract filters
        filters = data.get('filters', {})
        
        # Extract pagination
        pagination = data.get('pagination', {})
        page = pagination.get('page', 1)
        per_page = pagination.get('per_page', 20)
        
        # Extract sorting
        sort = data.get('sort', {})
        sort_field = sort.get('field', 'id')
        sort_direction = sort.get('direction', 'asc')
        
        # Validate pagination
        try:
            page = int(page)
            per_page = int(per_page)
            if page < 1:
                page = 1
            if per_page < 1 or per_page > 100:
                per_page = 20
        except (ValueError, TypeError):
            page = 1
            per_page = 20
        
        with get_db_session() as session:
            # Start with base query
            query = session.query(BatteryData)
            
            # Apply filters
            if 'continents' in filters and filters['continents']:
                query = query.filter(BatteryData.continent.in_(filters['continents']))
            
            if 'countries' in filters and filters['countries']:
                query = query.filter(BatteryData.country.in_(filters['countries']))
            
            if 'climates' in filters and filters['climates']:
                query = query.filter(BatteryData.climate.in_(filters['climates']))
            
            if 'model_series' in filters and filters['model_series']:
                query = query.filter(BatteryData.model_series.in_(filters['model_series']))
            
            if 'variables' in filters and filters['variables']:
                query = query.filter(BatteryData.var.in_(filters['variables']))
            
            if 'value_range' in filters and filters['value_range']:
                if 'min' in filters['value_range'] and filters['value_range']['min'] is not None:
                    query = query.filter(BatteryData.val >= filters['value_range']['min'])
                
                if 'max' in filters['value_range'] and filters['value_range']['max'] is not None:
                    query = query.filter(BatteryData.val <= filters['value_range']['max'])
            
            if 'vehicle_count_range' in filters and filters['vehicle_count_range']:
                if 'min' in filters['vehicle_count_range'] and filters['vehicle_count_range']['min'] is not None:
                    query = query.filter(BatteryData.cnt_vhcl >= filters['vehicle_count_range']['min'])
                
                if 'max' in filters['vehicle_count_range'] and filters['vehicle_count_range']['max'] is not None:
                    query = query.filter(BatteryData.cnt_vhcl <= filters['vehicle_count_range']['max'])
            
            # Apply sorting
            if sort_field == 'id':
                query = query.order_by(BatteryData.id.asc() if sort_direction == 'asc' else BatteryData.id.desc())
            elif sort_field == 'batt_alias':
                query = query.order_by(BatteryData.batt_alias.asc() if sort_direction == 'asc' else BatteryData.batt_alias.desc())
            elif sort_field == 'country':
                query = query.order_by(BatteryData.country.asc() if sort_direction == 'asc' else BatteryData.country.desc())
            elif sort_field == 'continent':
                query = query.order_by(BatteryData.continent.asc() if sort_direction == 'asc' else BatteryData.continent.desc())
            elif sort_field == 'climate':
                query = query.order_by(BatteryData.climate.asc() if sort_direction == 'asc' else BatteryData.climate.desc())
            elif sort_field == 'model_series':
                query = query.order_by(BatteryData.model_series.asc() if sort_direction == 'asc' else BatteryData.model_series.desc())
            elif sort_field == 'var':
                query = query.order_by(BatteryData.var.asc() if sort_direction == 'asc' else BatteryData.var.desc())
            elif sort_field == 'val':
                query = query.order_by(BatteryData.val.asc() if sort_direction == 'asc' else BatteryData.val.desc())
            elif sort_field == 'cnt_vhcl':
                query = query.order_by(BatteryData.cnt_vhcl.asc() if sort_direction == 'asc' else BatteryData.cnt_vhcl.desc())
            
            # Apply execution timeout to prevent long-running queries
            query = query.execution_options(statement_timeout=15000)
            
            # Get total count for pagination
            total_count = query.count()
            
            # Apply pagination
            results = query.offset((page - 1) * per_page).limit(per_page).all()
            
            # Convert results to dictionary
            data = [{
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
            
            # Calculate pagination info
            total_pages = (total_count + per_page - 1) // per_page  # Ceiling division
            
            return jsonify({
                'data': data,
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total_count': total_count,
                    'total_pages': total_pages
                },
                'sort': {
                    'field': sort_field,
                    'direction': sort_direction
                }
            })
    
    except Exception as e:
        logger.error(f"Error applying enhanced filters: {str(e)}")
        return jsonify({'error': 'Failed to apply filters'}), 500
