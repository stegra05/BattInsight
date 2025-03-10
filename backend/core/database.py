"""
Database connection and session management for BattInsight.
"""
import logging
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from flask import current_app

# Configure logging
logger = logging.getLogger(__name__)

# Create base class for SQLAlchemy models
Base = declarative_base()

# Global session factory
Session = None
engine = None

def init_db(app):
    """Initialize database connection and create tables.
    
    Args:
        app: Flask application instance
    """
    global Session, engine
    
    try:
        # Create engine
        engine = create_engine(
            app.config['SQLALCHEMY_DATABASE_URI'],
            echo=app.config.get('SQLALCHEMY_ECHO', False)
        )
        
        # Create session factory
        session_factory = sessionmaker(bind=engine)
        Session = scoped_session(session_factory)
        
        # Create tables
        Base.metadata.create_all(engine)
        
        logger.info(f"Database initialized with URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

@contextmanager
def get_db_session():
    """Get a database session with automatic cleanup.
    
    Yields:
        SQLAlchemy session
    """
    session = Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Database session error: {str(e)}")
        raise
    finally:
        session.close()

def get_engine():
    """Get the SQLAlchemy engine.
    
    Returns:
        SQLAlchemy engine
    """
    return engine
