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

from flask import Flask
import config

# Initialisiere Flask-Anwendung
app = Flask(__name__)

# Lade Konfigurationswerte aus config.py
app.config.from_object(config)

# Registriere die API-Routen
from routes.data_routes import data_routes
from routes.filter_routes import filter_routes
app.register_blueprint(data_routes)
app.register_blueprint(filter_routes)

# Optional: Initialisiere die Datenbank, falls erforderlich
# from database import init_db
# init_db(app)

if __name__ == '__main__':
    import os  # Added to read environment variables
    import socket  # Added for dynamic port selection

    def get_free_port():
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('', 0))
        port = s.getsockname()[1]
        s.close()
        return port

    # Use the PORT environment variable if available; otherwise, choose a free port dynamically
    port = os.environ.get('PORT')
    if port:
        port = int(port)
    else:
        port = get_free_port()
    print(f"Starting server on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)