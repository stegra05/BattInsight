"""
Zweck: Beinhaltet Testfälle für die API.
Funktionen:
	•	Unit-Tests für API-Endpunkte (pytest).
	•	Mock-Datenbank für Tests.
Abhängigkeiten:
	•	pytest als Test-Framework.
	•	Flask für API-Tests.
    •	mock für Mock-Objekte.
"""

import sys
import os
# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pytest
from backend.app import app
from unittest.mock import patch

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_get_countries_success(client):
    with patch('routes.filter_routes.get_all_countries') as mock_get_all_countries:
        mock_get_all_countries.return_value = ['USA', 'Germany']
        response = client.get('/api/filter/countries')
        data = response.get_json()
        assert response.status_code == 200
        assert 'countries' in data
        assert data['countries'] == ['USA', 'Germany']


def test_get_countries_failure(client):
    with patch('routes.filter_routes.get_all_countries') as mock_get_all_countries:
        mock_get_all_countries.side_effect = Exception('Test Error')
        response = client.get('/api/filter/countries')
        data = response.get_json()
        assert response.status_code == 500
        assert 'error' in data
        assert 'Test Error' in data['error']


def test_get_battery_types_success(client):
    with patch('routes.filter_routes.get_all_battery_types') as mock_get_all_battery_types:
        mock_get_all_battery_types.return_value = ['Lithium-Ionen', 'Nickel-Metallhydrid']
        response = client.get('/api/filter/battery-types')
        data = response.get_json()
        assert response.status_code == 200
        assert 'battery_types' in data
        assert data['battery_types'] == ['Lithium-Ionen', 'Nickel-Metallhydrid']


def test_get_battery_types_failure(client):
    with patch('routes.filter_routes.get_all_battery_types') as mock_get_all_battery_types:
        mock_get_all_battery_types.side_effect = Exception('Test Error')
        response = client.get('/api/filter/battery-types')
        data = response.get_json()
        assert response.status_code == 500
        assert 'error' in data
        assert 'Test Error' in data['error']


def test_get_failure_modes_success(client):
    with patch('routes.filter_routes.get_all_failure_modes') as mock_get_all_failure_modes:
        mock_get_all_failure_modes.return_value = ['Overheating', 'Short Circuit']
        response = client.get('/api/filter/failure-modes')
        data = response.get_json()
        assert response.status_code == 200
        assert 'failure_modes' in data
        assert data['failure_modes'] == ['Overheating', 'Short Circuit']


def test_get_failure_modes_failure(client):
    with patch('routes.filter_routes.get_all_failure_modes') as mock_get_all_failure_modes:
        mock_get_all_failure_modes.side_effect = Exception('Test Error')
        response = client.get('/api/filter/failure-modes')
        data = response.get_json()
        assert response.status_code == 500
        assert 'error' in data
        assert 'Test Error' in data['error']