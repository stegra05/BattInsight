"""
Zweck: Initialisiert die Datenbank mit einer CSV-Datei.
Funktionen:
	• Lädt battery_failures.csv in die Datenbank.
	• Erstellt Tabellen falls nicht vorhanden.
Abhängigkeiten:
	• database.py für den Zugriff auf die DB.
	• models.py für Tabellenstrukturen.
	• pandas zum Einlesen der CSV-Datei.
"""

import pandas as pd
from database import engine, SessionLocal
import models


def init_db():
    # Erstelle alle Tabellen, falls diese noch nicht existieren
    models.Base.metadata.create_all(bind=engine)
    print("Tabellen wurden erstellt (falls nicht bereits vorhanden).")

    # Lese die CSV-Datei
    try:
        df = pd.read_csv("data/world_kpi_anonym.csv")
        print("CSV-Datei data/world_kpi_anonym.csv wurde erfolgreich geladen.")
    except FileNotFoundError:
        print("Fehler: Die Datei data/world_kpi_anonym.csv wurde nicht gefunden.")
        return
    except Exception as e:
        print(f"Ein Fehler ist beim Laden der CSV-Datei aufgetreten: {e}")
        return

    # Erstelle eine Datenbank-Session
    session = SessionLocal()

    try:
        # Iteriere über die Zeilen des DataFrame und füge die Daten zur Datenbank hinzu.
        for index, row in df.iterrows():
            # Erstelle ein neues Objekt der Klasse BatteryFailure aus models.
            # Es wird angenommen, dass die Spaltennamen in der CSV-Datei genau den Attributen der Klasse entsprechen.
            battery_failure = models.BatteryFailure(**row.to_dict())
            session.add(battery_failure)
        session.commit()
        print("Daten wurden erfolgreich in die Datenbank eingefügt.")
    except Exception as e:
        session.rollback()
        print(f"Fehler beim Einfügen der Daten in die Datenbank: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    init_db()