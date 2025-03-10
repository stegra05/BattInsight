"""Ziel & Funktion:
	•	Stellt die Verbindung zur PostgreSQL-Datenbank her.
	•	Definiert die Datenbankverbindung und Session-Handling.
Abhängigkeiten:
	•	Wird von allen Modulen verwendet, die auf die Datenbank zugreifen müssen.
"""

import os
import logging
from contextlib import contextmanager
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create a base class for declarative models
Base = declarative_base()

# Create a database engine
engine = create_engine(
    os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/battinsight'),
    pool_pre_ping=True,  # Enable connection health checks
    pool_recycle=3600,   # Recycle connections after 1 hour
    echo=False           # Set to True for SQL query logging
)

# Create a session factory
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a thread-local session registry
db_session = scoped_session(Session)

# Initialize the database
def init_db(app):
    """Initialize the database with the application context."""
    # Import models here to avoid circular imports
    import models
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Register teardown context
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

@contextmanager
def get_db_session():
    """Get a database session with automatic cleanup."""
    session = Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def create_tables():
    """Create all tables defined in the models."""
    import models  # Import models here to ensure they are registered with Base
    Base.metadata.create_all(engine)

def drop_tables():
    """Drop all tables defined in the models."""
    import models  # Import models here to ensure they are registered with Base
    Base.metadata.drop_all(engine)

def check_db_connection():
    """Check if the database connection is working."""
    try:
        with get_db_session() as session:
            session.execute("SELECT 1")
        return True
    except Exception as e:
        logging.error(f"Database connection check failed: {e}")
        return False