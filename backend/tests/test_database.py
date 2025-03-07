"""
Zweck: Beinhaltet Testfälle für die Database.
Funktionen:
	•	Unit-Tests für Database (pytest).
	•	Mock-Datenbank für Tests.
Abhängigkeiten:
	•	pytest als Test-Framework.
    	•	mock für Mock-Objekte.
"""

import sys
import os
# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pytest
from unittest.mock import MagicMock

# Importiere die Database-Klasse aus dem entsprechenden Modul.
# Passe den Importpfad bei Bedarf an.
from backend.database import Database


@pytest.fixture
def db():
    """Fixture zum Erstellen einer Mock-Datenbank-Instanz."""
    db_instance = Database()
    db_instance.connect = MagicMock(return_value=True)
    db_instance.insert = MagicMock(return_value=42)
    db_instance.query = MagicMock(return_value=[{"id": 1, "data": "value"}])
    db_instance.update = MagicMock(return_value=1)  # Mock update method
    db_instance.disconnect = MagicMock(return_value=True)
    return db_instance


def test_database_connection(db):
    """Testet die erfolgreiche Verbindung zur Datenbank."""
    result = db.connect()
    assert result is True
    db.connect.assert_called_once()


def test_database_insert(db):
    """Testet das Einfügen von Daten in die Datenbank."""
    result = db.insert("some data")
    assert result == 42
    db.insert.assert_called_once_with("some data")


def test_database_query(db):
    """Testet das Abfragen von Daten aus der Datenbank."""
    result = db.query("SELECT * FROM table")
    assert result == [{"id": 1, "data": "value"}]
    db.query.assert_called_once_with("SELECT * FROM table")


def test_database_update(db):
    """Testet das Aktualisieren von Daten in der Datenbank."""
    result = db.update("UPDATE table SET data='new value' WHERE id=1")
    assert result == 1
    db.update.assert_called_once_with("UPDATE table SET data='new value' WHERE id=1")


def test_database_disconnect(db):
    """Testet das Trennen der Verbindung zur Datenbank."""
    result = db.disconnect()
    assert result is True
    db.disconnect.assert_called_once()


def test_database_connection_failure(db):
    """Testet den Umgang mit einer Verbindungsfehlersituation."""
    db.connect.side_effect = Exception("Connection failed")
    with pytest.raises(Exception) as excinfo:
        db.connect()
    assert "Connection failed" in str(excinfo.value)


def test_database_insert_failure(db):
    """Testet den Umgang mit einem Fehler beim Einfügen von Daten."""
    db.insert.side_effect = Exception("Insert failed")
    with pytest.raises(Exception) as excinfo:
        db.insert("faulty data")
    assert "Insert failed" in str(excinfo.value)