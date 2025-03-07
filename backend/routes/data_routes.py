"""
Zweck: Definiert API-Endpunkte zum Abrufen der Batteriedaten.
Funktionen:
    • /api/data: Gibt alle Batterieausfälle zurück.
    • /api/data/<country>: Gibt Batterieausfälle für ein bestimmtes Land zurück.
Abhängigkeiten:
    • models.py für Datenbankabfragen.
    • database.py für Session-Handling.
"""

from flask import Blueprint, jsonify, request
from database import SessionLocal
from models import BatteryFailure
import logging

logger = logging.getLogger(__name__)
data_routes = Blueprint('data_routes', __name__)

@data_routes.route("/", methods=['GET'])
def get_all_battery_failures():
    session = SessionLocal()
    try:
        battery_failures = session.query(models.BatteryFailure).all()
        return jsonify(battery_failures=[bf.serialize() for bf in battery_failures])
    except Exception as e:
        return jsonify(error="Interner Serverfehler"), 500
    finally:
        session.close()

@data_routes.route("/<country>", methods=['GET'])
def get_battery_failures_by_country(country: str):
    session = SessionLocal()
    try:
        battery_failures = session.query(models.BatteryFailure).filter(models.BatteryFailure.country == country).all()
        if not battery_failures:
            return jsonify(error=f"Keine Daten für das Land {country} gefunden"), 404
        return jsonify(battery_failures=[bf.serialize() for bf in battery_failures])
    except Exception as e:
        return jsonify(error="Interner Serverfehler"), 500
    finally:
        session.close()

@data_routes.route('/api/battery-failures', methods=['GET'])
def get_battery_failures():
    session = SessionLocal()
    try:
        # Get query parameters for filtering
        country = request.args.get('country')
        battery_type = request.args.get('batteryType')

        # Start with base query
        query = session.query(BatteryFailure)

        # Apply filters if provided
        if country:
            query = query.filter(BatteryFailure.country == country)
        if battery_type:
            query = query.filter(BatteryFailure.battery_type == battery_type)

        # Execute query and get results
        failures = query.all()
        
        # Convert to list of dictionaries
        result = [failure.serialize() for failure in failures]
        
        logger.info(f"Retrieved {len(result)} battery failures")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error retrieving battery failures: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        session.close()