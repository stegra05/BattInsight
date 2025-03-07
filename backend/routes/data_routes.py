"""
Zweck: Definiert API-Endpunkte zum Abrufen der Batteriedaten.
Funktionen:
	•	/api/data: Gibt alle Batterieausfälle zurück.
	•	/api/data/<country>: Gibt Batterieausfälle für ein bestimmtes Land zurück.
Abhängigkeiten:
	•	models.py für Datenbankabfragen.
	•	database.py für Session-Handling.
"""

from fastapi import APIRouter, HTTPException
from database import SessionLocal
import models

router = APIRouter()

@router.get("/api/data")
def get_all_battery_failures():
    session = SessionLocal()
    try:
        battery_failures = session.query(models.BatteryFailure).all()
        return battery_failures
    except Exception as e:
        raise HTTPException(status_code=500, detail="Interner Serverfehler")
    finally:
        session.close()


@router.get("/api/data/{country}")
def get_battery_failures_by_country(country: str):
    session = SessionLocal()
    try:
        battery_failures = session.query(models.BatteryFailure).filter(models.BatteryFailure.country == country).all()
        if not battery_failures:
            raise HTTPException(status_code=404, detail=f"Keine Daten für das Land {country} gefunden")
        return battery_failures
    except Exception as e:
        raise HTTPException(status_code=500, detail="Interner Serverfehler")
    finally:
        session.close()