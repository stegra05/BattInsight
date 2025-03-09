"""
Ziel & Funktion:
	•	Haupt-Einstiegspunkt der Flask-Anwendung.
	•	Initialisiert die Flask-App, lädt Konfigurationen (z. B. aus der .env) und bindet alle API-Routen ein.
Abhängigkeiten:
	•	Importiert Module wie data_routes.py, filter_routes.py und ai_query.py, um die entsprechenden Endpunkte bereitzustellen.
	•	Nutzt database.py für die Datenbankverbindung.
"""