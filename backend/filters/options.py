"""Filter options endpoints.

This module provides endpoints for retrieving filter options like countries, continents, etc.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import func, distinct
from sqlalchemy.exc import SQLAlchemyError
from ..database import db_session
from .utils import create_cached_response, handle_db_error, handle_general_error

# Create a Blueprint for filter options routes
filter_options_bp = Blueprint('filter_options', __name__)


@filter_options_bp.route('/', methods=['GET'])
def get_filter_options():
    """Get all available filter options for the battery data.
    
    Returns:
        JSON response with all possible filter values for each filter category
    """
    try:
        # Import BatteryData here to avoid circular imports
        from ..models import BatteryData
        
        with db_session() as session:
            # Get all distinct values for each filter category
            batt_aliases = [alias[0] for alias in session.query(distinct(BatteryData.batt_alias))
                           .order_by(BatteryData.batt_alias).all() if alias[0]]
            
            countries = [country[0] for country in session.query(distinct(BatteryData.country))
                        .order_by(BatteryData.country).all() if country[0]]
            
            continents = [continent[0] for continent in session.query(distinct(BatteryData.continent))
                         .order_by(BatteryData.continent).all() if continent[0]]
            
            climates = [climate[0] for climate in session.query(distinct(BatteryData.climate))
                       .order_by(BatteryData.climate).all() if climate[0]]
            
            iso_a3s = [iso[0] for iso in session.query(distinct(BatteryData.iso_a3))
                      .order_by(BatteryData.iso_a3).all() if iso[0]]
            
            model_series = [series[0] for series in session.query(distinct(BatteryData.model_series))
                           .order_by(BatteryData.model_series).all() if series[0] is not None]
            
            vars_list = [var[0] for var in session.query(distinct(BatteryData.var))
                        .order_by(BatteryData.var).all() if var[0]]
            
            # Add database query timeout for min/max values
            val_min_max = session.query(func.min(BatteryData.val), func.max(BatteryData.val))\
                            .execution_options(statement_timeout=15000).first()
            val_range = {
                'min': val_min_max[0],
                'max': val_min_max[1]
            }
            
            cnt_vhcl_min_max = session.query(func.min(BatteryData.cnt_vhcl), func.max(BatteryData.cnt_vhcl))\
                            .execution_options(statement_timeout=15000).first()
            cnt_vhcl_range = {
                'min': cnt_vhcl_min_max[0],
                'max': cnt_vhcl_min_max[1]
            }
            
            # Create response with cache control headers
            return create_cached_response({
                'filter_options': {
                    'batt_alias': batt_aliases,
                    'country': countries,
                    'continent': continents,
                    'climate': climates,
                    'iso_a3': iso_a3s,
                    'model_series': model_series,
                    'var': vars_list,
                    'val_range': val_range,
                    'cnt_vhcl_range': cnt_vhcl_range
                }
            })
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "get_filter_options")
    except Exception as e:
        return handle_general_error(e, "get_filter_options")


@filter_options_bp.route('/countries', methods=['GET'])
def get_countries():
    """Get all available countries with their ISO A3 codes.
    
    Returns:
        JSON response with countries and their ISO A3 codes
    """
    try:
        # Import BatteryData here to avoid circular imports
        from ..models import BatteryData
        
        with db_session() as session:
            # Query distinct countries and their ISO A3 codes with timeout
            countries_data = session.query(
                BatteryData.country, 
                BatteryData.iso_a3
            ).distinct().filter(
                BatteryData.country.isnot(None),
                BatteryData.iso_a3.isnot(None)
            ).order_by(BatteryData.country)\
            .execution_options(statement_timeout=15000).all()
            
            # Format the result
            countries = [{
                'name': country,
                'iso_a3': iso_a3
            } for country, iso_a3 in countries_data]
            
            return create_cached_response({'countries': countries})
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "get_countries")
    except Exception as e:
        return handle_general_error(e, "get_countries")


@filter_options_bp.route('/continents', methods=['GET'])
def get_continents():
    """Get all available continents.
    
    Returns:
        JSON response with continents
    """
    try:
        # Import BatteryData here to avoid circular imports
        from ..models import BatteryData
        
        with db_session() as session:
            # Query distinct continents with timeout
            continents = [continent[0] for continent in session.query(distinct(BatteryData.continent))
                         .filter(BatteryData.continent.isnot(None))
                         .order_by(BatteryData.continent)
                         .execution_options(statement_timeout=15000).all()]
            
            return create_cached_response({'continents': continents})
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "get_continents")
    except Exception as e:
        return handle_general_error(e, "get_continents")


@filter_options_bp.route('/climates', methods=['GET'])
def get_climates():
    """Get all available climate types.
    
    Returns:
        JSON response with climate types
    """
    try:
        # Import BatteryData here to avoid circular imports
        from ..models import BatteryData
        
        with db_session() as session:
            # Query distinct climate types with timeout
            climates = [climate[0] for climate in session.query(distinct(BatteryData.climate))
                       .filter(BatteryData.climate.isnot(None))
                       .order_by(BatteryData.climate)
                       .execution_options(statement_timeout=15000).all()]
            
            return create_cached_response({'climates': climates})
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "get_climates")
    except Exception as e:
        return handle_general_error(e, "get_climates")


@filter_options_bp.route('/model_series', methods=['GET'])
def get_model_series():
    """Get all available model series.
    
    Returns:
        JSON response with model series
    """
    try:
        # Import BatteryData here to avoid circular imports
        from ..models import BatteryData
        
        with db_session() as session:
            # Query distinct model series with timeout
            model_series = [series[0] for series in session.query(distinct(BatteryData.model_series))
                           .filter(BatteryData.model_series.isnot(None))
                           .order_by(BatteryData.model_series)
                           .execution_options(statement_timeout=15000).all()]
            
            return create_cached_response({'model_series': model_series})
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "get_model_series")
    except Exception as e:
        return handle_general_error(e, "get_model_series")


@filter_options_bp.route('/variables', methods=['GET'])
def get_variables():
    """Get all available variables (var) with their descriptions.
    
    Returns:
        JSON response with variables and their descriptions
    """
    try:
        # Import BatteryData here to avoid circular imports
        from ..models import BatteryData
        
        with db_session() as session:
            # Query distinct variables and their descriptions with timeout
            var_data = session.query(
                BatteryData.var, 
                BatteryData.descr
            ).distinct().filter(
                BatteryData.var.isnot(None)
            ).order_by(BatteryData.var)\
            .execution_options(statement_timeout=15000).all()
            
            # Format the result
            variables = [{
                'name': var,
                'description': descr
            } for var, descr in var_data]
            
            return create_cached_response({'variables': variables})
    
    except SQLAlchemyError as e:
        return handle_db_error(e, "get_variables")
    except Exception as e:
        return handle_general_error(e, "get_variables")