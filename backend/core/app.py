"""
Main Flask application for BattInsight.
"""
import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from werkzeug.middleware.proxy_fix import ProxyFix

from backend.core.config import get_config
from backend.core.database import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Initialize extensions
limiter = Limiter(key_func=get_remote_address)
cache = Cache()

def create_app(test_config=None):
    """Create and configure the Flask application.
    
    Args:
        test_config: Test configuration dictionary
        
    Returns:
        Flask application instance
    """
    # Create Flask app
    app = Flask(__name__, instance_relative_config=True)
    
    # Apply ProxyFix to handle proxy headers correctly
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
    
    # Load configuration
    config = get_config()
    app.config.from_object(config)
    
    # Override with test config if provided
    if test_config:
        app.config.update(test_config)
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass
    
    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})
    limiter.init_app(app)
    cache.init_app(app)
    
    # Initialize database
    with app.app_context():
        init_db(app)
    
    # Register blueprints
    from backend.api.data_routes import data_routes
    from backend.api.filter_routes import filter_routes
    from backend.api.ai_query_routes import ai_query_routes
    from backend.api.export_routes import export_routes
    from backend.api.mapbox_routes import mapbox_routes
    
    app.register_blueprint(data_routes, url_prefix=app.config['API_PREFIX'])
    app.register_blueprint(filter_routes, url_prefix=f"{app.config['API_PREFIX']}/filter")
    app.register_blueprint(ai_query_routes, url_prefix=f"{app.config['API_PREFIX']}/ai-query")
    app.register_blueprint(export_routes, url_prefix=f"{app.config['API_PREFIX']}/export")
    app.register_blueprint(mapbox_routes, url_prefix=f"{app.config['API_PREFIX']}/mapbox")
    
    # Register error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Resource not found"}, 404
    
    @app.errorhandler(500)
    def server_error(error):
        logger.error(f"Server error: {error}")
        return {"error": "Internal server error"}, 500
    
    # Register health check endpoint
    @app.route('/healthcheck', methods=['GET'])
    def healthcheck():
        """Health check endpoint for monitoring."""
        return {
            "status": "healthy",
            "version": "1.0.0",
            "environment": app.config['ENV']
        }
    
    # Register API health check endpoint
    @app.route(f"{app.config['API_PREFIX']}/healthcheck", methods=['GET'])
    def api_healthcheck():
        """Health check endpoint for API monitoring."""
        return {
            "status": "healthy",
            "version": "1.0.0",
            "environment": app.config['ENV']
        }
    
    logger.info(f"Application initialized in {app.config['ENV']} mode")
    return app
