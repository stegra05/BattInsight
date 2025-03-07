"""
	•	Zweck: Hauptdatei für den Flask-Webserver und API-Endpunkt-Registrierung.
Funktionen:
	•	Initialisiert Flask-Anwendung.
	•	Lädt Konfigurationswerte aus config.py.
	•	Registriert die API-Routen aus routes/.
	•	Startet den Webserver.
Abhängigkeiten:
	•	routes/data_routes.py für Daten-Endpunkte.
	•	routes/filter_routes.py für Filterlogik.
	•	database.py für den Datenbankzugriff.
	•	config.py für Konfigurationseinstellungen.
"""