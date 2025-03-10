"""Filters package.

This package contains all filter-related modules for the BattInsight application.
It provides functionality for filtering battery data based on various criteria.
"""

from flask import Blueprint

# Import the component blueprints
from .options import filter_options_bp
from .apply import filter_apply_bp
from .docs import filter_docs_bp, setup_rate_limiting

# Create a main Blueprint for filter routes with url_prefix='/filter'
filter_routes = Blueprint('filter_routes', __name__, url_prefix='/filter')

# Register the component blueprints with their own URL prefixes
filter_routes.register_blueprint(filter_options_bp, url_prefix='/options')
filter_routes.register_blueprint(filter_apply_bp, url_prefix='/apply')
filter_routes.register_blueprint(filter_docs_bp, url_prefix='/docs')

# Export the filter_routes and setup_rate_limiting function
__all__ = ['filter_routes', 'setup_rate_limiting']