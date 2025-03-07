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

from flask import Flask, send_from_directory, send_file
from flask_cors import CORS
import config
import os
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialisiere Flask-Anwendung
app = Flask(__name__)
CORS(app)

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

# Update static directory configuration
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build'))
app.static_folder = static_dir
app.static_url_path = ''

@app.route('/static/<path:path>')
def serve_static(path):
    logger.debug(f"Serving static file: {path}")
    return send_from_directory(os.path.join(static_dir, 'static'), path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    try:
        logger.debug(f"Requested path: {path}")
        # First try to serve as a static file
        if path and os.path.exists(os.path.join(static_dir, path)):
            logger.debug(f"Serving existing file: {path}")
            return send_from_directory(static_dir, path)
            
        # For all other routes, serve index.html
        logger.debug("Serving index.html")
        return send_file(os.path.join(static_dir, 'index.html'))
    except Exception as e:
        logger.error(f"Error serving path {path}: {str(e)}")
        return "Internal Server Error", 500

if __name__ == '__main__':
    port = 53557
    logger.info(f"Starting server on port {port}")
    logger.info(f"Static files will be served from: {static_dir}")
    # Ensure the static directory exists
    if not os.path.exists(static_dir):
        logger.error(f"Static directory does not exist: {static_dir}")
    else:
        logger.info("Static directory found")
    app.run(debug=True, host='0.0.0.0', port=port)