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
from models.database import SessionLocal
from models.models import BatteryFailure
import logging

logger = logging.getLogger(__name__)
data_routes = Blueprint('data_routes', __name__)

@data_routes.route("/", methods=['GET'])
def get_all_battery_failures():
    session = SessionLocal()
    try:
        battery_failures = session.query(BatteryFailure).all()
        return jsonify(battery_failures=[bf.serialize() for bf in battery_failures])
    except Exception as e:
        return jsonify(error="Interner Serverfehler"), 500
    finally:
        session.close()

@data_routes.route("/<country>", methods=['GET'])
def get_battery_failures_by_country(country: str):
    session = SessionLocal()
    try:
        battery_failures = session.query(BatteryFailure).filter(BatteryFailure.country == country).all()
        if not battery_failures:
            return jsonify(error=f"Keine Daten für das Land {country} gefunden"), 404
        return jsonify(battery_failures=[bf.serialize() for bf in battery_failures])
    except Exception as e:
        return jsonify(error="Interner Serverfehler"), 500
    finally:
        session.close()