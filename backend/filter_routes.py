"""Ziel & Funktion:
	•	Bietet REST API-Endpunkte (z. B. /api/filter), die es erlauben, Daten dynamisch anhand verschiedener Filterkriterien abzurufen.
Abhängigkeiten:
	•	Greift auf database.py für Datenbankoperationen und auf models.py für die Datenstruktur zu.
"""

from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import func, distinct
from sqlalchemy.exc import SQLAlchemyError
from database import db_session
from models import BatteryData

# Create a Blueprint for filter routes
filter_routes = Blueprint('filter_routes', __name__)

@filter_routes.route('/filter/options', methods=['GET'])
def get_filter_options():
    """Get all available filter options for the battery data.
    
    Returns:
        JSON response with all possible filter values for each filter category
    """
    try:
        with db_session() as session:
            # Get all distinct values for each filter category
            batt_aliases = [alias[0] for alias in session.query(distinct(BatteryData.batt_alias)).order_by(BatteryData.batt_alias).all() if alias[0]]
            countries = [country[0] for country in session.query(distinct(BatteryData.country)).order_by(BatteryData.country).all() if country[0]]
            continents = [continent[0] for continent in session.query(distinct(BatteryData.continent)).order_by(BatteryData.continent).all() if continent[0]]
            climates = [climate[0] for climate in session.query(distinct(BatteryData.climate)).order_by(BatteryData.climate).all() if climate[0]]
            iso_a3s = [iso[0] for iso in session.query(distinct(BatteryData.iso_a3)).order_by(BatteryData.iso_a3).all() if iso[0]]
            model_series = [series[0] for series in session.query(distinct(BatteryData.model_series)).order_by(BatteryData.model_series).all() if series[0] is not None]
            vars_list = [var[0] for var in session.query(distinct(BatteryData.var)).order_by(BatteryData.var).all() if var[0]]
            
            # Fix 2: Add database query timeout for min/max values
            val_min_max = session.query(func.min(BatteryData.val), func.max(BatteryData.val))\
                            .execution_options(statement_timeout=15000).first()
            val_range = {
                'min': val_min_max[0],
                'max': val_min_max[1]
            }
            
            cnt_vhcl_min_max = session.query(func.min(BatteryData.cnt_vhcl), func.max(BatteryData.cnt_vhcl))\
                            .execution_options(statement_timeout=15000).first()
            cnt_vhcl_range = {
                'min': cnt_vhcl_min_max[0],
                'max': cnt_vhcl_min_max[1]
            }
            
            # Fix 1: Create response with cache control headers
            response = jsonify({
                'filter_options': {
                    'batt_alias': batt_aliases,
                    'country': countries,
                    'continent': continents,
                    'climate': climates,
                    'iso_a3': iso_a3s,
                    'model_series': model_series,
                    'var': vars_list,
                    'val_range': val_range,
                    'cnt_vhcl_range': cnt_vhcl_range
                }
            })
            response.headers.set('Cache-Control', 'public, max-age=3600')
            return response
    
    except SQLAlchemyError as e:
        # Fix 5: Structured error logging and hiding raw DB errors
        current_app.logger.error(f"Database error in get_filter_options: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_filter_options: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@filter_routes.route('/filter/countries', methods=['GET'])
def get_countries():
    """Get all available countries with their ISO A3 codes.
    
    Returns:
        JSON response with countries and their ISO A3 codes
    """
    try:
        with db_session() as session:
            # Query distinct countries and their ISO A3 codes with timeout
            countries_data = session.query(
                BatteryData.country, 
                BatteryData.iso_a3
            ).distinct().filter(
                BatteryData.country.isnot(None),
                BatteryData.iso_a3.isnot(None)
            ).order_by(BatteryData.country)\
            .execution_options(statement_timeout=15000).all()
            
            # Format the result
            countries = [{
                'name': country,
                'iso_a3': iso_a3
            } for country, iso_a3 in countries_data]
            
            # Add cache control headers
            response = jsonify({'countries': countries})
            response.headers.set('Cache-Control', 'public, max-age=3600')
            return response
    
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in get_countries: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_countries: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@filter_routes.route('/filter/continents', methods=['GET'])
def get_continents():
    """Get all available continents.
    
    Returns:
        JSON response with continents
    """
    try:
        with db_session() as session:
            # Query distinct continents with timeout
            continents = [continent[0] for continent in session.query(distinct(BatteryData.continent))
                         .filter(BatteryData.continent.isnot(None))
                         .order_by(BatteryData.continent)
                         .execution_options(statement_timeout=15000).all()]
            
            # Add cache control headers
            response = jsonify({'continents': continents})
            response.headers.set('Cache-Control', 'public, max-age=3600')
            return response
    
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in get_continents: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_continents: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@filter_routes.route('/filter/climates', methods=['GET'])
def get_climates():
    """Get all available climate types.
    
    Returns:
        JSON response with climate types
    """
    try:
        with db_session() as session:
            # Query distinct climate types with timeout
            climates = [climate[0] for climate in session.query(distinct(BatteryData.climate))
                       .filter(BatteryData.climate.isnot(None))
                       .order_by(BatteryData.climate)
                       .execution_options(statement_timeout=15000).all()]
            
            # Add cache control headers
            response = jsonify({'climates': climates})
            response.headers.set('Cache-Control', 'public, max-age=3600')
            return response
    
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in get_climates: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_climates: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@filter_routes.route('/filter/model_series', methods=['GET'])
def get_model_series():
    """Get all available model series.
    
    Returns:
        JSON response with model series
    """
    try:
        with db_session() as session:
            # Query distinct model series with timeout
            model_series = [series[0] for series in session.query(distinct(BatteryData.model_series))
                           .filter(BatteryData.model_series.isnot(None))
                           .order_by(BatteryData.model_series)
                           .execution_options(statement_timeout=15000).all()]
            
            # Add cache control headers
            response = jsonify({'model_series': model_series})
            response.headers.set('Cache-Control', 'public, max-age=3600')
            return response
    
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in get_model_series: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_model_series: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@filter_routes.route('/filter/variables', methods=['GET'])
def get_variables():
    """Get all available variables (var) with their descriptions.
    
    Returns:
        JSON response with variables and their descriptions
    """
    try:
        with db_session() as session:
            # Query distinct variables and their descriptions with timeout
            var_data = session.query(
                BatteryData.var, 
                BatteryData.descr
            ).distinct().filter(
                BatteryData.var.isnot(None)
            ).order_by(BatteryData.var)\
            .execution_options(statement_timeout=15000).all()
            
            # Format the result, handling duplicate vars with different descriptions
            var_dict = {}
            for var, descr in var_data:
                if var not in var_dict:
                    var_dict[var] = descr
            
            variables = [{
                'var': var,
                'description': descr
            } for var, descr in var_dict.items()]
            
            # Add cache control headers
            response = jsonify({'variables': variables})
            response.headers.set('Cache-Control', 'public, max-age=3600')
            return response
    
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in get_variables: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_variables: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@filter_routes.route('/filter/apply', methods=['POST'])
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
        # Get request data
        request_data = request.get_json()
        
        if not request_data or 'filters' not in request_data:
            return jsonify({'error': 'No filters provided'}), 400
        
        # Fix 3: Validate input JSON structure
        if not isinstance(request_data.get('filters', {}), dict):
            return jsonify({'error': 'Invalid filter format'}), 400
        
        filters = request_data['filters']
        
        # Validate page and per_page parameters
        try:
            page = int(request_data.get('page', 1))
            per_page = int(request_data.get('per_page', 100))
            if page < 1:
                page = 1
            if per_page < 1:
                per_page = 100
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid pagination parameters'}), 400
        
        # Limit per_page to prevent excessive data retrieval
        if per_page > 1000:
            per_page = 1000
        
        # Fix 4: Limit maximum filter values
        MAX_FILTER_VALUES = 50
        for filter_type, values in filters.items():
            if isinstance(values, list) and len(values) > MAX_FILTER_VALUES:
                return jsonify({'error': f'Too many values for {filter_type} filter (max {MAX_FILTER_VALUES})'}), 400
        
        # Start building the query
        with db_session() as session:
            query = session.query(BatteryData)
            
            # Apply filters with validation
            if 'batt_alias' in filters and filters['batt_alias']:
                if not isinstance(filters['batt_alias'], list):
                    return jsonify({'error': 'batt_alias filter must be a list'}), 400
                query = query.filter(BatteryData.batt_alias.in_(filters['batt_alias']))
            
            if 'country' in filters and filters['country']:
                if not isinstance(filters['country'], list):
                    return jsonify({'error': 'country filter must be a list'}), 400
                query = query.filter(BatteryData.country.in_(filters['country']))
            
            if 'continent' in filters and filters['continent']:
                if not isinstance(filters['continent'], list):
                    return jsonify({'error': 'continent filter must be a list'}), 400
                query = query.filter(BatteryData.continent.in_(filters['continent']))
            
            if 'climate' in filters and filters['climate']:
                if not isinstance(filters['climate'], list):
                    return jsonify({'error': 'climate filter must be a list'}), 400
                query = query.filter(BatteryData.climate.in_(filters['climate']))
            
            if 'iso_a3' in filters and filters['iso_a3']:
                if not isinstance(filters['iso_a3'], list):
                    return jsonify({'error': 'iso_a3 filter must be a list'}), 400
                query = query.filter(BatteryData.iso_a3.in_(filters['iso_a3']))
            
            if 'model_series' in filters and filters['model_series']:
                if not isinstance(filters['model_series'], list):
                    return jsonify({'error': 'model_series filter must be a list'}), 400
                query = query.filter(BatteryData.model_series.in_(filters['model_series']))
            
            if 'var' in filters and filters['var']:
                if not isinstance(filters['var'], list):
                    return jsonify({'error': 'var filter must be a list'}), 400
                query = query.filter(BatteryData.var.in_(filters['var']))
            
            # Apply range filters
            if 'val_range' in filters and filters['val_range']:
                if not isinstance(filters['val_range'], dict):
                    return jsonify({'error': 'val_range filter must be an object with min and max properties'}), 400
                
                if 'min' in filters['val_range'] and filters['val_range']['min'] is not None:
                    try:
                        min_val = float(filters['val_range']['min'])
                        query = query.filter(BatteryData.val >= min_val)
                    except (ValueError, TypeError):
                        return jsonify({'error': 'Invalid min value in val_range filter'}), 400
                
                if 'max' in filters['val_range'] and filters['val_range']['max'] is not None:
                    try:
                        max_val = float(filters['val_range']['max'])
                        query = query.filter(BatteryData.val <= max_val)
                    except (ValueError, TypeError):
                        return jsonify({'error': 'Invalid max value in val_range filter'}), 400
            
            if 'cnt_vhcl_range' in filters and filters['cnt_vhcl_range']:
                if not isinstance(filters['cnt_vhcl_range'], dict):
                    return jsonify({'error': 'cnt_vhcl_range filter must be an object with min and max properties'}), 400
                
                if 'min' in filters['cnt_vhcl_range'] and filters['cnt_vhcl_range']['min'] is not None:
                    try:
                        min_cnt = int(filters['cnt_vhcl_range']['min'])
                        query = query.filter(BatteryData.cnt_vhcl >= min_cnt)
                    except (ValueError, TypeError):
                        return jsonify({'error': 'Invalid min value in cnt_vhcl_range filter'}), 400
                
                if 'max' in filters['cnt_vhcl_range'] and filters['cnt_vhcl_range']['max'] is not None:
                    try:
                        max_cnt = int(filters['cnt_vhcl_range']['max'])
                        query = query.filter(BatteryData.cnt_vhcl <= max_cnt)
                    except (ValueError, TypeError):
                        return jsonify({'error': 'Invalid max value in cnt_vhcl_range filter'}), 400
            
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
                }
            })
    
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in apply_filters: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in apply_filters: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500