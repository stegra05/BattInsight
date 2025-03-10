import pytest
import json
from unittest.mock import patch, Mock
from flask import Flask, jsonify
from backend.filters.utils import (
    create_cached_response,
    handle_db_error,
    handle_general_error,
    validate_pagination_params,
    validate_filter_list
)

@pytest.fixture
def app():
    """Create a Flask app for testing."""
    app = Flask(__name__)
    app.config['TESTING'] = True
    return app

@pytest.fixture
def app_context(app):
    """Create an app context for testing."""
    with app.app_context():
        yield

def test_create_cached_response():
    """Test creating a response with cache control headers."""
    # Test with default cache time
    data = {'test': 'data'}
    response = create_cached_response(data)
    
    assert response.json == data
    assert 'Cache-Control' in response.headers
    assert 'public, max-age=3600' in response.headers['Cache-Control']
    
    # Test with custom cache time
    custom_cache_time = 7200
    response = create_cached_response(data, custom_cache_time)
    assert f'public, max-age={custom_cache_time}' in response.headers['Cache-Control']

def test_handle_db_error(app_context):
    """Test handling database errors."""
    with patch('flask.current_app.logger.error') as mock_logger:
        error = Exception('Database error')
        response, status_code = handle_db_error(error, 'test_function')
        
        # Verify logger was called with correct parameters
        mock_logger.assert_called_once()
        assert 'test_function' in mock_logger.call_args[0][0]
        assert 'Database error' in mock_logger.call_args[0][0]
        
        # Verify response
        assert status_code == 500
        assert 'error' in response.json
        assert 'Database operation failed' in response.json['error']

def test_handle_general_error(app_context):
    """Test handling general exceptions."""
    with patch('flask.current_app.logger.error') as mock_logger:
        error = Exception('General error')
        response, status_code = handle_general_error(error, 'test_function')
        
        # Verify logger was called with correct parameters
        mock_logger.assert_called_once()
        assert 'test_function' in mock_logger.call_args[0][0]
        assert 'General error' in mock_logger.call_args[0][0]
        
        # Verify response
        assert status_code == 500
        assert 'error' in response.json
        assert 'Internal server error' in response.json['error']

@pytest.mark.parametrize("page,per_page,expected_page,expected_per_page", [
    (None, None, 1, 100),  # Default values
    (2, 50, 2, 50),         # Valid values
    (0, 0, 1, 100),         # Invalid values (too low)
    (5, 2000, 5, 1000),     # Invalid value (per_page too high)
    ('2', '50', 2, 50),     # String values that can be converted
])
def test_validate_pagination_params_valid(page, per_page, expected_page, expected_per_page):
    """Test validating and normalizing valid pagination parameters."""
    result_page, result_per_page = validate_pagination_params(page, per_page)
    assert result_page == expected_page
    assert result_per_page == expected_per_page

@pytest.mark.parametrize("page,per_page", [
    ('invalid', None),      # Invalid page
    (None, 'invalid'),      # Invalid per_page
    ('invalid', 'invalid'), # Both invalid
])
def test_validate_pagination_params_invalid(page, per_page):
    """Test validating invalid pagination parameters."""
    with pytest.raises(ValueError, match="Invalid pagination parameters"):
        validate_pagination_params(page, per_page)

def test_validate_filter_list_valid():
    """Test validating a valid filter list."""
    filter_value = ['value1', 'value2']
    filter_name = 'test_filter'
    
    # Should not raise an exception
    result = validate_filter_list(filter_value, filter_name)
    assert result is True

def test_validate_filter_list_invalid():
    """Test validating an invalid filter list."""
    filter_value = 'not_a_list'
    filter_name = 'test_filter'
    
    with pytest.raises(ValueError, match="test_filter filter must be a list"):
        validate_filter_list(filter_value, filter_name)