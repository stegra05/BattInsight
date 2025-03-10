"""Ziel & Funktion:
	•	Baut die Verbindung zur PostgreSQL-Datenbank auf und stellt Funktionen zur Verwaltung von Datenbank-Sessions bereit.
	•	Wird als zentraler Punkt für alle datenbankbezogenen Operationen genutzt.
Abhängigkeiten:
	•	Wird von fast allen anderen Backend-Modulen (z. B. app.py, init_db.py, ai_query.py) importiert.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager

# Create a base class for declarative class definitions
Base = declarative_base()

# Global variables for engine and session factory
engine = None
Session = None

def init_db(app):
    """Initialize the database connection.
    
    Args:
        app: Flask application instance with configuration.
    """
    global engine, Session
    
    # Create database engine
    database_uri = app.config['DATABASE_URI']
    engine = create_engine(database_uri)
    
    # Create session factory
    session_factory = sessionmaker(bind=engine)
    Session = scoped_session(session_factory)
    
    # Import models to ensure they are registered with the Base
    from models import BatteryData
    
    return engine

def get_db_session():
    """Get a database session.
    
    Returns:
        SQLAlchemy session object.
    """
    if Session is None:
        raise RuntimeError("Database not initialized. Call init_db first.")
    return Session()

@contextmanager
def db_session():
    """Context manager for database sessions.
    
    Yields:
        SQLAlchemy session object.
    """
    session = get_db_session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def create_tables():
    """Create all tables defined in the models."""
    if engine is None:
        raise RuntimeError("Database not initialized. Call init_db first.")
    Base.metadata.create_all(engine)

def drop_tables():
    """Drop all tables defined in the models."""
    if engine is None:
        raise RuntimeError("Database not initialized. Call init_db first.")
    Base.metadata.drop_all(engine)