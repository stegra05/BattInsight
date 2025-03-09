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
import os
from database import engine, SessionLocal
import models

script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, "..", "data", "world_kpi_anonym.csv")
print(f"Script directory: {script_dir}")
print(f"CSV path: {csv_path}")

def init_db():
    # Erstelle alle Tabellen, falls diese noch nicht existieren
    models.Base.metadata.create_all(bind=engine)
    print("Tabellen wurden erstellt (falls nicht bereits vorhanden).")

    # Lese die CSV-Datei
    try:
        print(f"Attempting to read CSV from: {csv_path}")
        print(f"File exists: {os.path.exists(csv_path)}")
        print(f"Directory contents of {os.path.dirname(csv_path)}:")
        try:
            print(os.listdir(os.path.dirname(csv_path)))
        except Exception as e:
            print(f"Could not list directory: {e}")
            
        # Modified CSV reading with proper separator
        df = pd.read_csv(
            csv_path,
            sep=';',           # Use semicolon as separator
            encoding='utf-8',  # Keep explicit encoding
        )
        
        # Clean column names if needed
        df.columns = df.columns.str.strip()
        
        print("\nDataFrame Info:")
        print(df.info())
        print("\nColumns:")
        print(df.columns.tolist())
        print("\nFirst few rows:")
        print(df.head())
        
        print(f"CSV-Datei {csv_path} wurde erfolgreich geladen.")
    except FileNotFoundError as e:
        print(f"Fehler: Die Datei {csv_path} wurde nicht gefunden.")
        print(f"Error details: {str(e)}")
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