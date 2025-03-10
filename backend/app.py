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

# Configure logging
log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join('backend', 'logs', 'app.log')),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Configure the app
    app_config = {
        'TESTING': False,
        'DEBUG': os.environ.get('FLASK_DEBUG', '0') == '1',
        'SQLALCHEMY_DATABASE_URI': os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/battinsight'),
        'SECRET_KEY': os.environ.get('SECRET_KEY', 'dev_key_replace_in_production'),
        'OPENAI_API_KEY': os.environ.get('OPENAI_API_KEY', None),
        'CACHE_TYPE': 'SimpleCache',
        'CACHE_DEFAULT_TIMEOUT': 300
    }
    
    # Override with test config if provided
    if test_config:
        app_config.update(test_config)
    
    app.config.from_mapping(app_config)
    
    # Initialize CORS
    CORS(app)
    
    # Log application startup
    logger.info(f"Starting application in {os.environ.get('FLASK_ENV', 'development')} mode")
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass
    
    # Initialize database
    with app.app_context():
        init_db(app)
    
    # Initialize rate limiter
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://",
    )
    
    # Initialize cache
    cache = Cache(app)
    
    # Register blueprints
    app.register_blueprint(data_routes)
    app.register_blueprint(ai_query_routes)
    app.register_blueprint(filter_routes)
    
    # Setup rate limiting
    setup_rate_limiting(limiter)
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def server_error(error):
        logger.error(f"Server error: {error}")
        return jsonify({"error": "Internal server error"}), 500
    
    @app.route('/healthcheck', methods=['GET'])
    def healthcheck():
        """Health check endpoint for monitoring."""
        return jsonify({
            "status": "healthy",
            "version": "1.0.0",
            "environment": os.environ.get('FLASK_ENV', 'development')
        })
    
    logger.info("Application successfully configured and routes registered")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])
