"""
Mapbox integration routes for BattInsight API.
"""
import os
import json
import logging
import requests
from flask import Blueprint, jsonify, request, current_app
from backend.core.database import get_db_session
from backend.core.models import BatteryData
from sqlalchemy import func, distinct

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
mapbox_routes = Blueprint('mapbox_routes', __name__)

# Country code to coordinates mapping (for countries without proper geocoding)
COUNTRY_COORDINATES = {
    'DEU': {'lat': 51.1657, 'lng': 10.4515},  # Germany
    'FRA': {'lat': 46.2276, 'lng': 2.2137},   # France
    'USA': {'lat': 37.0902, 'lng': -95.7129}, # United States
    'GBR': {'lat': 55.3781, 'lng': -3.4360},  # United Kingdom
    'CHN': {'lat': 35.8617, 'lng': 104.1954}, # China
    'JPN': {'lat': 36.2048, 'lng': 138.2529}, # Japan
    'IND': {'lat': 20.5937, 'lng': 78.9629},  # India
    'BRA': {'lat': -14.2350, 'lng': -51.9253}, # Brazil
    'CAN': {'lat': 56.1304, 'lng': -106.3468}, # Canada
    'AUS': {'lat': -25.2744, 'lng': 133.7751}, # Australia
}

@mapbox_routes.route('/country-data', methods=['GET'])
def get_country_data():
    """Get aggregated battery data by country for map visualization.
    
    Query parameters:
        var: Filter by variable name
        model_series: Filter by model series
        
    Returns:
        JSON response with country data for map visualization
    """
    try:
        # Get query parameters
        var = request.args.get('var')
        model_series = request.args.get('model_series')
        
        with get_db_session() as session:
            # Start with base query
            query = session.query(
                BatteryData.country,
                BatteryData.iso_a3,
                func.avg(BatteryData.val).label('avg_val'),
                func.count(BatteryData.id).label('count')
            ).group_by(BatteryData.country, BatteryData.iso_a3)
            
            # Apply filters
            if var:
                query = query.filter(BatteryData.var == var)
            
            if model_series:
                query = query.filter(BatteryData.model_series == model_series)
            
            # Execute query
            results = query.all()
            
            # Format results for map visualization
            country_data = {}
            for country, iso_a3, avg_val, count in results:
                if not country or not iso_a3:
                    continue
                
                country_data[iso_a3] = {
                    'country': country,
                    'iso_a3': iso_a3,
                    'average': float(avg_val) if avg_val is not None else 0,
                    'count': count,
                    'coordinates': COUNTRY_COORDINATES.get(iso_a3, None)
                }
            
            # Get min/max values for color scale
            min_val = min([data['average'] for data in country_data.values()]) if country_data else 0
            max_val = max([data['average'] for data in country_data.values()]) if country_data else 0
            
            return jsonify({
                'country_data': country_data,
                'value_range': {
                    'min': min_val,
                    'max': max_val
                }
            })
    
    except Exception as e:
        logger.error(f"Error getting country data: {str(e)}")
        return jsonify({'error': 'Failed to get country data'}), 500

@mapbox_routes.route('/geocode', methods=['GET'])
def geocode_country():
    """Geocode a country name or ISO code to coordinates.
    
    Query parameters:
        country: Country name or ISO code
        
    Returns:
        JSON response with coordinates
    """
    try:
        # Get query parameters
        country = request.args.get('country')
        
        if not country:
            return jsonify({'error': 'Missing country parameter'}), 400
        
        # Check if country is an ISO code in our mapping
        if country in COUNTRY_COORDINATES:
            return jsonify({
                'country': country,
                'coordinates': COUNTRY_COORDINATES[country]
            })
        
        # Get Mapbox access token
        mapbox_token = current_app.config.get('MAPBOX_ACCESS_TOKEN')
        if not mapbox_token:
            return jsonify({'error': 'Mapbox access token not found'}), 500
        
        # Call Mapbox Geocoding API
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{country}.json"
        params = {
            'access_token': mapbox_token,
            'types': 'country',
            'limit': 1
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if not data.get('features'):
            return jsonify({'error': 'Country not found'}), 404
        
        # Extract coordinates
        feature = data['features'][0]
        coordinates = {
            'lng': feature['center'][0],
            'lat': feature['center'][1]
        }
        
        return jsonify({
            'country': country,
            'coordinates': coordinates,
            'place_name': feature.get('place_name')
        })
    
    except Exception as e:
        logger.error(f"Error geocoding country: {str(e)}")
        return jsonify({'error': 'Failed to geocode country'}), 500

@mapbox_routes.route('/config', methods=['GET'])
def get_mapbox_config():
    """Get Mapbox configuration for frontend.
    
    Returns:
        JSON response with Mapbox configuration
    """
    try:
        # Get Mapbox access token
        mapbox_token = current_app.config.get('MAPBOX_ACCESS_TOKEN')
        if not mapbox_token:
            return jsonify({'error': 'Mapbox access token not found'}), 500
        
        return jsonify({
            'access_token': mapbox_token,
            'style': 'mapbox://styles/mapbox/light-v10',
            'default_center': [0, 20],
            'default_zoom': 1
        })
    
    except Exception as e:
        logger.error(f"Error getting Mapbox config: {str(e)}")
        return jsonify({'error': 'Failed to get Mapbox config'}), 500
