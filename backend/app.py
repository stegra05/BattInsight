"""Ziel & Funktion:
	•	Haupt-Einstiegspunkt der Flask-Anwendung.
	•	Initialisiert die Flask-App, lädt Konfigurationen (z. B. aus der .env) und bindet alle API-Routen ein.
Abhängigkeiten:
	•	Importiert Module wie data_routes.py, filter_routes.py und ai_query.py, um die entsprechenden Endpunkte bereitzustellen.
	•	Nutzt database.py für die Datenbankverbindung.
"""

import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from .database import init_db, get_db_session
# Remove the top-level import of BatteryData
# from models import BatteryData
from .data_routes import data_routes
from .ai_query import ai_query_routes
from .filters import filter_routes, setup_rate_limiting

# Load environment variables from .env file
load_dotenv()

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Configure the app with standard SQLAlchemy config keys
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/battinsight'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        OPENAI_API_KEY=os.environ.get('OPENAI_API_KEY'),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024  # Limit request size to 16MB
    )

    # Override config with test config if provided
    if test_config:
        app.config.update(test_config)
    
    # Verify required configuration values
    required_config = ['SQLALCHEMY_DATABASE_URI', 'SECRET_KEY']
    for key in required_config:
        if not app.config.get(key):
            raise ValueError(f"Missing required config value: {key}")
    
    # Configure logging
    if app.config.get('LOG_FILE'):
        file_handler = logging.FileHandler(app.config.get('LOG_FILE'))
        file_handler.setLevel(logging.WARNING)
        app.logger.addHandler(file_handler)
    
    # Secure CORS configuration - restrict to frontend URL
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv('FRONTEND_URL', 'http://localhost:3000'),
            "methods": ["GET", "POST"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Add production security settings
    if os.getenv('FLASK_ENV') == 'production':
        app.config.update(
            SESSION_COOKIE_SECURE=True,
            SESSION_COOKIE_HTTPONLY=True,
            SESSION_COOKIE_SAMESITE='Lax'
        )
    
    # Initialize the database
    init_db(app)
    
    # Register CLI commands for database operations
    try:
        from .init_db import register_cli_commands
        register_cli_commands(app)
    except (ImportError, AttributeError):
        # If the import fails, try a different approach
        try:
            from init_db import register_cli_commands
            register_cli_commands(app)
        except (ImportError, AttributeError):
            app.logger.warning("Could not register CLI commands for database operations")
    
    # Set up periodic database refresh if configured
    if app.config.get('ENABLE_AUTO_REFRESH', False):
        try:
            from init_db import schedule_periodic_refresh
            schedule_periodic_refresh(app)
        except (ImportError, AttributeError):
            app.logger.warning("Could not set up periodic database refresh")
    
    # Register blueprints with URL prefixes
    app.register_blueprint(data_routes, url_prefix='/api')
    app.register_blueprint(ai_query_routes, url_prefix='/api')
    app.register_blueprint(filter_routes, url_prefix='/api')

    # Set up rate limiting for filter routes
    setup_rate_limiting(app, filter_routes)

    # Error handling
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/healthcheck', methods=['GET'])
    def healthcheck():
        return jsonify({'status': 'healthy', 'version': '1.0.0'})
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
