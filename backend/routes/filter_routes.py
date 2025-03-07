"""
Zweck: Bietet API-Routen für Filteroptionen (nach Batterieart, Land etc.).
Funktionen:
	•	/api/filter/countries: Gibt alle verfügbaren Länder zurück.
	•	/api/filter/battery-types: Gibt alle Batterietypen zurück.
	•	/api/filter/manufacturers: Gibt alle Hersteller zurück.
Abhängigkeiten:
	•	models.py für die Datenbankabfragen.
"""

from flask import Blueprint, jsonify, request
from models.models import get_all_countries, get_all_battery_types, get_all_manufacturers, get_battery_performance_by_country, get_battery_performance_by_climate, get_model_series_distribution, get_vehicle_count, get_continent_summary, get_outliers

filter_routes = Blueprint('filter_routes', __name__, url_prefix='/api/filter')

@filter_routes.route('/countries', methods=['GET'])
def get_countries():
    try:
        countries = get_all_countries()
        return jsonify(countries=countries)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/battery-types', methods=['GET'])
def get_battery_types():
    try:
        battery_types = get_all_battery_types()
        return jsonify(battery_types=battery_types)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/manufacturers', methods=['GET'])
def get_manufacturers():
    try:
        manufacturers = get_all_manufacturers()
        return jsonify(manufacturers=manufacturers)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/v1/battery-performance/country', methods=['GET'])
def battery_performance_by_country():
    try:
        battAlias = request.args.get('battAlias')
        var = request.args.get('var')
        data = get_battery_performance_by_country(battAlias, var)
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/v1/battery-performance/climate', methods=['GET'])
def battery_performance_by_climate():
    try:
        battAlias = request.args.get('battAlias')
        data = get_battery_performance_by_climate(battAlias)
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/v1/model-series-distribution', methods=['GET'])
def model_series_distribution():
    try:
        data = get_model_series_distribution()
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/v1/vehicle-count', methods=['GET'])
def vehicle_count():
    try:
        data = get_vehicle_count()
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/v1/continent-summary', methods=['GET'])
def continent_summary():
    try:
        data = get_continent_summary()
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

@filter_routes.route('/v1/outliers', methods=['GET'])
def outliers():
    try:
        data = get_outliers()
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500
