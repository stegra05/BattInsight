"""Ziel & Funktion:
	•	Stellt REST API-Endpunkte bereit (z. B. /api/data), über die vollständige Datensätze abgerufen werden können.
	•	Ermöglicht den Zugriff auf alle in der Datenbank gespeicherten Daten.
Abhängigkeiten:
	•	Verwendet database.py und models.py zur Ausführung von Abfragen.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import func
from database import db_session
from models import BatteryData

# Create a Blueprint for data routes
data_routes = Blueprint('data_routes', __name__)

@data_routes.route('/data', methods=['GET'])
def get_data():
    """Get battery data with optional filtering.
    
    Query parameters:
        page (int): Page number for pagination (default: 1)
        per_page (int): Number of items per page (default: 100)
        batt_alias (str): Filter by battery alias
        country (str): Filter by country
        continent (str): Filter by continent
        climate (str): Filter by climate
        iso_a3 (str): Filter by ISO A3 code
        model_series (int): Filter by model series
        var (str): Filter by variable
        min_val (float): Filter by minimum value
        max_val (float): Filter by maximum value
        descr (str): Filter by description (partial match)
        min_cnt_vhcl (int): Filter by minimum vehicle count
        max_cnt_vhcl (int): Filter by maximum vehicle count
    
    Returns:
        JSON response with battery data and pagination info
    """
    try:
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 100, type=int)
        
        # Limit per_page to prevent excessive data retrieval
        if per_page > 1000:
            per_page = 1000
        
        # Start building the query
        with db_session() as session:
            query = session.query(BatteryData)
            
            # Apply filters based on query parameters
            if request.args.get('batt_alias'):
                query = query.filter(BatteryData.batt_alias == request.args.get('batt_alias'))
            
            if request.args.get('country'):
                query = query.filter(BatteryData.country == request.args.get('country'))
            
            if request.args.get('continent'):
                query = query.filter(BatteryData.continent == request.args.get('continent'))
            
            if request.args.get('climate'):
                query = query.filter(BatteryData.climate == request.args.get('climate'))
            
            if request.args.get('iso_a3'):
                query = query.filter(BatteryData.iso_a3 == request.args.get('iso_a3'))
            
            if request.args.get('model_series'):
                query = query.filter(BatteryData.model_series == request.args.get('model_series', type=int))
            
            if request.args.get('var'):
                query = query.filter(BatteryData.var == request.args.get('var'))
            
            # Numeric range filters
            if request.args.get('min_val'):
                query = query.filter(BatteryData.val >= request.args.get('min_val', type=float))
            
            if request.args.get('max_val'):
                query = query.filter(BatteryData.val <= request.args.get('max_val', type=float))
            
            if request.args.get('descr'):
                query = query.filter(BatteryData.descr.ilike(f'%{request.args.get("descr")}%'))
            
            if request.args.get('min_cnt_vhcl'):
                query = query.filter(BatteryData.cnt_vhcl >= request.args.get('min_cnt_vhcl', type=int))
            
            if request.args.get('max_cnt_vhcl'):
                query = query.filter(BatteryData.cnt_vhcl <= request.args.get('max_cnt_vhcl', type=int))
            
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
        # Fix 5: Structured error logging and hiding raw DB errors
        current_app.logger.error(f"Database error in get_data_stats: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_data_stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@data_routes.route('/data/stats', methods=['GET'])
def get_data_stats():
    """Get statistical information about the battery data.
    
    Returns:
        JSON response with statistics about the data
    """
    try:
        with db_session() as session:
            # Get count of records
            total_records = session.query(func.count(BatteryData.id)).scalar()
            
            # Get unique counts
            unique_batt_alias = session.query(func.count(func.distinct(BatteryData.batt_alias))).scalar()
            unique_countries = session.query(func.count(func.distinct(BatteryData.country))).scalar()
            unique_continents = session.query(func.count(func.distinct(BatteryData.continent))).scalar()
            unique_climates = session.query(func.count(func.distinct(BatteryData.climate))).scalar()
            unique_model_series = session.query(func.count(func.distinct(BatteryData.model_series))).scalar()
            unique_vars = session.query(func.count(func.distinct(BatteryData.var))).scalar()
            
            # Get min/max values
            min_val = session.query(func.min(BatteryData.val)).scalar()
            max_val = session.query(func.max(BatteryData.val)).scalar()
            min_cnt_vhcl = session.query(func.min(BatteryData.cnt_vhcl)).scalar()
            max_cnt_vhcl = session.query(func.max(BatteryData.cnt_vhcl)).scalar()
            
            return jsonify({
                'total_records': total_records,
                'unique_counts': {
                    'batt_alias': unique_batt_alias,
                    'countries': unique_countries,
                    'continents': unique_continents,
                    'climates': unique_climates,
                    'model_series': unique_model_series,
                    'vars': unique_vars
                },
                'value_ranges': {
                    'val': {
                        'min': min_val,
                        'max': max_val
                    },
                    'cnt_vhcl': {
                        'min': min_cnt_vhcl,
                        'max': max_cnt_vhcl
                    }
                }
            })
    
    except SQLAlchemyError as e:
        # Fix 5: Structured error logging and hiding raw DB errors
        current_app.logger.error(f"Database error in get_data_stats: {str(e)}")
        return jsonify({'error': 'Database operation failed'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error in get_data_stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500