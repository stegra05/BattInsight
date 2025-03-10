"""Ziel & Funktion:
	•	Haupt-Einstiegspunkt der Flask-Anwendung.
	•	Initialisiert die Flask-App, lädt Konfigurationen (z. B. aus der .env) und bindet alle API-Routen ein.
Abhängigkeiten:
	•	Importiert Module wie data_routes.py, filter_routes.py und ai_query.py, um die entsprechenden Endpunkte bereitzustellen.
	•	Nutzt database.py für die Datenbankverbindung.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import init_db, get_db_session
from data_routes import data_routes
from filter_routes import filter_routes
from ai_query import ai_query_routes

# Load environment variables from .env file
load_dotenv()

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Configure the app
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        DATABASE_URI=os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/battinsight'),
        OPENAI_API_KEY=os.environ.get('OPENAI_API_KEY')
    )

    # Override config with test config if provided
    if test_config:
        app.config.update(test_config)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Initialize the database
    init_db(app)
    
    # Register blueprints for API routes
    app.register_blueprint(data_routes, url_prefix='/api')
    app.register_blueprint(filter_routes, url_prefix='/api')
    app.register_blueprint(ai_query_routes, url_prefix='/api')
    
    # Error handling
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy'})
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)