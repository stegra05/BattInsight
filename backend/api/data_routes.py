"""
Data routes for BattInsight API.
"""
import logging
from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import func
from backend.core.database import get_db_session
from backend.core.models import BatteryData, ModelSeries
from backend.services.data_processor import process_and_import_data

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
data_routes = Blueprint('data_routes', __name__)

@data_routes.route('/data', methods=['GET'])
def get_data():
    """Get battery data with optional filtering.
    
    Query parameters:
        country (str): Filter by country
        continent (str): Filter by continent
        climate (str): Filter by climate
        model_series (int): Filter by model series
        var (str): Filter by variable name
        val_min (float): Filter by minimum value
        val_max (float): Filter by maximum value
        limit (int): Limit number of results
        offset (int): Offset for pagination
        
    Returns:
        JSON response with battery data
    """
    try:
        # Get query parameters
        country = request.args.get('country')
        continent = request.args.get('continent')
        climate = request.args.get('climate')
        model_series = request.args.get('model_series')
        var = request.args.get('var')
        val_min = request.args.get('val_min')
        val_max = request.args.get('val_max')
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        with get_db_session() as session:
            # Start with base query
            query = session.query(BatteryData)
            
            # Apply filters
            if country:
                query = query.filter(BatteryData.country == country)
            
            if continent:
                query = query.filter(BatteryData.continent == continent)
            
            if climate:
                query = query.filter(BatteryData.climate == climate)
            
            if model_series:
                query = query.filter(BatteryData.model_series == model_series)
            
            if var:
                query = query.filter(BatteryData.var == var)
            
            if val_min:
                query = query.filter(BatteryData.val >= float(val_min))
            
            if val_max:
                query = query.filter(BatteryData.val <= float(val_max))
            
            # Get total count
            total_count = query.count()
            
            # Apply pagination
            query = query.limit(limit).offset(offset)
            
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
            
            return jsonify({
                'data': data,
                'metadata': {
                    'total_count': total_count,
                    'limit': limit,
                    'offset': offset
                }
            })
    
    except Exception as e:
        logger.error(f"Error getting data: {str(e)}")
        return jsonify({'error': 'Failed to get data'}), 500

@data_routes.route('/stats', methods=['GET'])
def get_stats():
    """Get statistics about the battery data.
    
    Returns:
        JSON response with statistics
    """
    try:
        with get_db_session() as session:
            # Get total records
            total_records = session.query(func.count(BatteryData.id)).scalar() or 0
            
            # Get average value
            avg_value = session.query(func.avg(BatteryData.val)).scalar() or 0
            
            # Get country count
            countries_count = session.query(func.count(func.distinct(BatteryData.country))).scalar() or 0
            
            # Get model series count
            models_count = session.query(func.count(func.distinct(BatteryData.model_series))).scalar() or 0
            
            # Get climate count
            climates_count = session.query(func.count(func.distinct(BatteryData.climate))).scalar() or 0
            
            return jsonify({
                'totalRecords': total_records,
                'avgValue': float(avg_value),
                'countriesCount': countries_count,
                'modelsCount': models_count,
                'climatesCount': climates_count
            })
    
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        return jsonify({'error': 'Failed to get stats'}), 500

@data_routes.route('/import', methods=['POST'])
def import_data():
    """Import data from CSV file.
    
    Returns:
        JSON response with import status
    """
    try:
        # Get CSV file path from config
        csv_file_path = current_app.config['CSV_FILE_PATH']
        
        # Process and import data
        result = process_and_import_data(csv_file_path)
        
        return jsonify({
            'success': True,
            'message': 'Data imported successfully',
            'records_imported': result['records_imported']
        })
    
    except Exception as e:
        logger.error(f"Error importing data: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to import data: {str(e)}'
        }), 500
