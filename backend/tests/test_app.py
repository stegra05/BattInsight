import sys
import os
# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pytest
from backend.app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    # Test the root endpoint returns the welcome message
    response = client.get('/')
    assert response.status_code == 200
    assert b"Welcome to the Battery Failure Visualization API" in response.data

def test_unknown_route(client):
    # Test that an unknown route returns a 404
    response = client.get('/nonexistent')
    assert response.status_code == 404

def test_battery_status(client):
    # Test the /battery-status endpoint returns the battery status
    response = client.get('/battery-status')
    assert response.status_code == 200
    assert b"Battery status: OK" in response.data