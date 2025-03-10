"""Filter API documentation and rate limiting.

This module provides OpenAPI documentation and rate limiting for filter routes.
"""

from flask import Blueprint, jsonify, request, current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from backend.database import db_session
# Remove the top-level import of BatteryData
# from models import BatteryData

# Create a Blueprint for filter documentation
filter_docs_bp = Blueprint('filter_docs', __name__)


def setup_rate_limiting(app, filter_routes_bp):
    """Set up rate limiting for the filter routes.
    
    Args:
        app: The Flask application instance
        filter_routes_bp: The filter routes blueprint
        
    Returns:
        Configured Limiter instance
    """
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["60 per minute", "1000 per hour"]
    )
    
    # Apply rate limiting to filter routes
    limiter.limit("60 per minute")(filter_routes_bp)
    
    return limiter


@filter_docs_bp.route('/spec', methods=['GET'])
def get_filter_spec():
    """Get OpenAPI specification for filter endpoints.
    
    Returns:
        JSON response with API documentation
    """
    return jsonify({
        "openapi": "3.0.0",
        "info": {
            "title": "BattInsight Filter API",
            "description": "API for filtering battery data",
            "version": "1.0.0"
        },
        "paths": {
            "/filter/options": {
                "get": {
                    "summary": "Get all available filter options",
                    "responses": {
                        "200": {
                            "description": "Successful response with filter options"
                        },
                        "500": {
                            "description": "Server error"
                        }
                    }
                }
            },
            "/filter/apply": {
                "post": {
                    "summary": "Apply filters to battery data",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "filters": {
                                            "type": "object",
                                            "properties": {
                                                "batt_alias": {"type": "array", "items": {"type": "string"}},
                                                "country": {"type": "array", "items": {"type": "string"}},
                                                "continent": {"type": "array", "items": {"type": "string"}},
                                                "climate": {"type": "array", "items": {"type": "string"}},
                                                "iso_a3": {"type": "array", "items": {"type": "string"}},
                                                "model_series": {"type": "array", "items": {"type": "integer"}},
                                                "var": {"type": "array", "items": {"type": "string"}},
                                                "val_range": {
                                                    "type": "object",
                                                    "properties": {
                                                        "min": {"type": "number"},
                                                        "max": {"type": "number"}
                                                    }
                                                },
                                                "cnt_vhcl_range": {
                                                    "type": "object",
                                                    "properties": {
                                                        "min": {"type": "integer"},
                                                        "max": {"type": "integer"}
                                                    }
                                                },
                                                "descr_search": {"type": "string"}
                                            }
                                        },
                                        "page": {"type": "integer", "default": 1},
                                        "per_page": {"type": "integer", "default": 100, "maximum": 1000}
                                    },
                                    "required": ["filters"]
                                },
                                "examples": {
                                    "basic": {
                                        "value": {
                                            "filters": {
                                                "continent": ["Europe", "Asia"],
                                                "climate": ["temperate"],
                                                "model_series": [1, 2],
                                                "val_range": {"min": 0, "max": 100},
                                                "cnt_vhcl_range": {"min": 10, "max": 1000}
                                            },
                                            "page": 1,
                                            "per_page": 50
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Successful response with filtered data"
                        },
                        "400": {
                            "description": "Invalid request format"
                        },
                        "500": {
                            "description": "Server error"
                        }
                    }
                }
            },
            "/filter/countries": {
                "get": {
                    "summary": "Get all available countries",
                    "responses": {
                        "200": {
                            "description": "Successful response with countries"
                        },
                        "500": {
                            "description": "Server error"
                        }
                    }
                }
            },
            "/filter/continents": {
                "get": {
                    "summary": "Get all available continents",
                    "responses": {
                        "200": {
                            "description": "Successful response with continents"
                        },
                        "500": {
                            "description": "Server error"
                        }
                    }
                }
            }
        }
    })