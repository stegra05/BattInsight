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
from database import init_db, get_db_session
from data_routes import data_routes
from filter_routes import filter_routes
from ai_query import ai_query_routes

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
    from init_db import register_cli_commands
    register_cli_commands(app)
    
    # Set up periodic database refresh if configured
    if app.config.get('ENABLE_AUTO_REFRESH', False):
        from init_db import schedule_periodic_refresh
        schedule_periodic_refresh(app)
    
    # Register blueprints for API routes with correct URL prefixes
    app.register_blueprint(data_routes, url_prefix='/api/data')
    # Verify Blueprint registration was updated from:
    app.register_blueprint(filter_routes, url_prefix='/api/filter')
    
    # To:
    from filters.options import filter_options_bp
    app.register_blueprint(filter_options_bp, url_prefix='/api/filter')
    app.register_blueprint(ai_query_routes, url_prefix='/api/ai-query')
    
    # Initialize rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )
    
    # Initialize cache
    cache = Cache(app, config={
        'CACHE_TYPE': 'SimpleCache',
        'CACHE_DEFAULT_TIMEOUT': 3600  # 1 hour default timeout
    })
    
    # Replace the placeholder cache decorator in data_routes
    from data_routes import cache_decorator
    data_routes.cache_decorator = cache.cached(timeout=3600)  # Cache for 1 hour
    
    # Validate JSON requests
    @app.before_request
    def validate_json():
        if request.method in ('POST', 'PUT') and request.is_json == False and request.content_type and 'application/json' in request.content_type:
            return jsonify({'error': 'Content-Type must be application/json'}), 415
    
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