"""
Zweck: Speichert Konfigurationswerte wie API-Keys, Datenbankpfad, Debug-Flags.
Funktionen:
	•	Definiert Konfigurationsvariablen (z. B. DATABASE_URL).
Abhängigkeiten:
	•	Wird von app.py und database.py importiert.
"""

# Debug-Flag
DEBUG = True

# Datenbankverbindungs-URL (Beispiel: SQLite-Datenbank)
DATABASE_URL = 'sqlite:///battery_failure.db'

# API-Key (Platzhalter, bitte ersetzen)
API_KEY = 'YOUR_API_KEY_HERE'