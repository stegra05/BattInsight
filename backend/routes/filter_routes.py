"""
Zweck: Bietet API-Routen für Filteroptionen (nach Batterieart, Land etc.).
Funktionen:
	•	/api/filter/countries: Gibt alle verfügbaren Länder zurück.
	•	/api/filter/battery-types: Gibt alle Batterietypen zurück.
Abhängigkeiten:
	•	models.py für die Datenbankabfragen.
"""

from flask import Blueprint, jsonify
from models import get_all_countries, get_all_battery_types

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
