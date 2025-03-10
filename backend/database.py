"""Ziel & Funktion:
	•	Baut die Verbindung zur PostgreSQL-Datenbank auf und stellt Funktionen zur Verwaltung von Datenbank-Sessions bereit.
	•	Wird als zentraler Punkt für alle datenbankbezogenen Operationen genutzt.
Abhängigkeiten:
	•	Wird von fast allen anderen Backend-Modulen (z. B. app.py, init_db.py, ai_query.py) importiert.
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from contextlib import contextmanager

# Create a base class for declarative class definitions
Base = declarative_base()

# Global variables for engine and session factory
engine = None
Session = None

def init_db(app):
    global engine, Session
    
    database_uri = app.config.get('SQLALCHEMY_DATABASE_URI')
    
    # Only use pooling for PostgreSQL
    engine_args = {}
    if 'postgresql' in database_uri:
        engine_args.update({
            'pool_size': 20,
            'max_overflow': 10,
            'pool_timeout': 30
        })
    
    engine = create_engine(
        database_uri,
        **engine_args
    )
    Session = scoped_session(sessionmaker(bind=engine))
    
    # Import models to ensure they are registered with the Base
    from .models import BatteryData
    
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
    except Exception as e:
        session.rollback()
        # Log the error with context if we have access to the Flask app
        try:
            current_app.logger.error(f"Database error: {str(e)}", exc_info=True)
        except RuntimeError:
            # If we're outside of application context, just pass
            pass
        raise
    finally:
        session.close()
        # Clear the scoped session to prevent resource leaks
        Session.remove()

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

def check_db_connection():
    """Check if the database connection is healthy.
    
    Returns:
        bool: True if connection is healthy, False otherwise.
    """
    if engine is None:
        return False
        
    try:
        # Execute a simple query to check connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except SQLAlchemyError as e:
        # Log the error if we have access to the Flask app
        try:
            current_app.logger.error(f"Database connection check failed: {str(e)}", exc_info=True)
        except RuntimeError:
            # If we're outside of application context, just pass
            pass
        return False