"""
Zweck: Definiert API-Endpunkte zum Abrufen der Batteriedaten.
Funktionen:
	•	/api/data: Gibt alle Batterieausfälle zurück.
	•	/api/data/<country>: Gibt Batterieausfälle für ein bestimmtes Land zurück.
Abhängigkeiten:
	•	models.py für Datenbankabfragen.
	•	database.py für Session-Handling.
"""