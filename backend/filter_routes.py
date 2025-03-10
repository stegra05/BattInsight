"""Ziel & Funktion:
	•	Bietet REST API-Endpunkte (z. B. /api/filter), die es erlauben, Daten dynamisch anhand verschiedener Filterkriterien abzurufen.
Abhängigkeiten:
	•	Greift auf database.py für Datenbankoperationen und auf models.py für die Datenstruktur zu.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import func, distinct
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
            
            # Get min/max values for numeric fields
            val_range = {
                'min': session.query(func.min(BatteryData.val)).scalar(),
                'max': session.query(func.max(BatteryData.val)).scalar()
            }
            
            cnt_vhcl_range = {
                'min': session.query(func.min(BatteryData.cnt_vhcl)).scalar(),
                'max': session.query(func.max(BatteryData.cnt_vhcl)).scalar()
            }
            
            return jsonify({
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
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@filter_routes.route('/filter/countries', methods=['GET'])
def get_countries():
    """Get all available countries with their ISO A3 codes.
    
    Returns:
        JSON response with countries and their ISO A3 codes
    """
    try:
        with db_session() as session:
            # Query distinct countries and their ISO A3 codes
            countries_data = session.query(
                BatteryData.country, 
                BatteryData.iso_a3
            ).distinct().filter(
                BatteryData.country.isnot(None),
                BatteryData.iso_a3.isnot(None)
            ).order_by(BatteryData.country).all()
            
            # Format the result
            countries = [{
                'name': country,
                'iso_a3': iso_a3
            } for country, iso_a3 in countries_data]
            
            return jsonify({'countries': countries})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@filter_routes.route('/filter/continents', methods=['GET'])
def get_continents():
    """Get all available continents.
    
    Returns:
        JSON response with continents
    """
    try:
        with db_session() as session:
            # Query distinct continents
            continents = [continent[0] for continent in session.query(distinct(BatteryData.continent))
                         .filter(BatteryData.continent.isnot(None))
                         .order_by(BatteryData.continent).all()]
            
            return jsonify({'continents': continents})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@filter_routes.route('/filter/climates', methods=['GET'])
def get_climates():
    """Get all available climate types.
    
    Returns:
        JSON response with climate types
    """
    try:
        with db_session() as session:
            # Query distinct climate types
            climates = [climate[0] for climate in session.query(distinct(BatteryData.climate))
                       .filter(BatteryData.climate.isnot(None))
                       .order_by(BatteryData.climate).all()]
            
            return jsonify({'climates': climates})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@filter_routes.route('/filter/model_series', methods=['GET'])
def get_model_series():
    """Get all available model series.
    
    Returns:
        JSON response with model series
    """
    try:
        with db_session() as session:
            # Query distinct model series
            model_series = [series[0] for series in session.query(distinct(BatteryData.model_series))
                           .filter(BatteryData.model_series.isnot(None))
                           .order_by(BatteryData.model_series).all()]
            
            return jsonify({'model_series': model_series})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@filter_routes.route('/filter/variables', methods=['GET'])
def get_variables():
    """Get all available variables (var) with their descriptions.
    
    Returns:
        JSON response with variables and their descriptions
    """
    try:
        with db_session() as session:
            # Query distinct variables and their descriptions
            var_data = session.query(
                BatteryData.var, 
                BatteryData.descr
            ).distinct().filter(
                BatteryData.var.isnot(None)
            ).order_by(BatteryData.var).all()
            
            # Format the result, handling duplicate vars with different descriptions
            var_dict = {}
            for var, descr in var_data:
                if var not in var_dict:
                    var_dict[var] = descr
            
            variables = [{
                'var': var,
                'description': descr
            } for var, descr in var_dict.items()]
            
            return jsonify({'variables': variables})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        
        filters = request_data['filters']
        page = request_data.get('page', 1)
        per_page = request_data.get('per_page', 100)
        
        # Limit per_page to prevent excessive data retrieval
        if per_page > 1000:
            per_page = 1000
        
        # Start building the query
        with db_session() as session:
            query = session.query(BatteryData)
            
            # Apply filters
            if 'batt_alias' in filters and filters['batt_alias']:
                query = query.filter(BatteryData.batt_alias.in_(filters['batt_alias']))
            
            if 'country' in filters and filters['country']:
                query = query.filter(BatteryData.country.in_(filters['country']))
            
            if 'continent' in filters and filters['continent']:
                query = query.filter(BatteryData.continent.in_(filters['continent']))
            
            if 'climate' in filters and filters['climate']:
                query = query.filter(BatteryData.climate.in_(filters['climate']))
            
            if 'iso_a3' in filters and filters['iso_a3']:
                query = query.filter(BatteryData.iso_a3.in_(filters['iso_a3']))
            
            if 'model_series' in filters and filters['model_series']:
                query = query.filter(BatteryData.model_series.in_(filters['model_series']))
            
            if 'var' in filters and filters['var']:
                query = query.filter(BatteryData.var.in_(filters['var']))
            
            # Range filters
            if 'val_range' in filters:
                val_range = filters['val_range']
                if 'min' in val_range and val_range['min'] is not None:
                    query = query.filter(BatteryData.val >= val_range['min'])
                if 'max' in val_range and val_range['max'] is not None:
                    query = query.filter(BatteryData.val <= val_range['max'])
            
            if 'cnt_vhcl_range' in filters:
                cnt_range = filters['cnt_vhcl_range']
                if 'min' in cnt_range and cnt_range['min'] is not None:
                    query = query.filter(BatteryData.cnt_vhcl >= cnt_range['min'])
                if 'max' in cnt_range and cnt_range['max'] is not None:
                    query = query.filter(BatteryData.cnt_vhcl <= cnt_range['max'])
            
            # Text search
            if 'descr_search' in filters and filters['descr_search']:
                query = query.filter(BatteryData.descr.ilike(f'%{filters["descr_search"]}%'))
            
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
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500