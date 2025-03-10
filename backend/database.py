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
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from dotenv import load_dotenv
from backend.base import Base
import psycopg2
from sqlalchemy.sql import text

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

# Add functionality for Docker and local db connections
def test_db_connection(docker_mode=False):
    """Test if the database connection is working."""
    try:
        host = "postgres" if docker_mode else "localhost"
        # Create a database engine
        connection_string = f'postgresql://postgres:postgres@{host}:5432/battinsight'
        
        engine = create_engine(
            connection_string,
            pool_pre_ping=True,  # Enable connection health checks
            pool_recycle=3600,   # Recycle connections after 1 hour
            echo=True            # Set to True for SQL query logging
        )
        
        # Create a session factory
        Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # Create a session
        session = Session()
        
        # Test the connection
        result = session.execute(text("SELECT 1"))
        print(f"Database connection test result: {result.scalar()}")
        
        # Close the session
        session.close()
        
        return True
    except Exception as e:
        print(f"Database connection test failed: {e}")
        return False

def create_tables_direct(docker_mode=False):
    """Create the tables directly in the database using raw SQL."""
    try:
        host = "postgres" if docker_mode else "localhost"
        print(f"Connecting to the database at {host}...")
        # Connect to the database
        conn = psycopg2.connect(
            host=host,
            database="battinsight",
            user="postgres",
            password="postgres"
        )
        
        print("Connected to the database")
        
        # Create a cursor
        cur = conn.cursor()
        
        print("Creating model_series table...")
        # Create the model_series table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS model_series (
            id SERIAL PRIMARY KEY,
            series_name VARCHAR(50) UNIQUE NOT NULL,
            release_year INTEGER,
            description TEXT,
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        )
        """)
        
        print("Creating battery_data table...")
        # Create the battery_data table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS battery_data (
            id SERIAL PRIMARY KEY,
            batt_alias VARCHAR(50) NOT NULL,
            country VARCHAR(100),
            continent VARCHAR(50),
            climate VARCHAR(50),
            iso_a3 VARCHAR(3),
            model_series_id INTEGER REFERENCES model_series(id),
            model_series INTEGER,
            var VARCHAR(50) NOT NULL,
            val FLOAT NOT NULL,
            descr VARCHAR(200),
            cnt_vhcl INTEGER,
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        )
        """)
        
        print("Creating indexes...")
        # Create indexes
        cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_batt_alias ON battery_data (batt_alias);
        CREATE INDEX IF NOT EXISTS idx_country ON battery_data (country);
        CREATE INDEX IF NOT EXISTS idx_continent ON battery_data (continent);
        CREATE INDEX IF NOT EXISTS idx_climate ON battery_data (climate);
        CREATE INDEX IF NOT EXISTS idx_iso_a3 ON battery_data (iso_a3);
        CREATE INDEX IF NOT EXISTS idx_model_series_id ON battery_data (model_series_id);
        CREATE INDEX IF NOT EXISTS idx_model_series ON battery_data (model_series);
        CREATE INDEX IF NOT EXISTS idx_var ON battery_data (var);
        CREATE INDEX IF NOT EXISTS idx_val_range ON battery_data (var, val);
        CREATE INDEX IF NOT EXISTS idx_location ON battery_data (country, continent, climate);
        """)
        
        print("Committing changes...")
        # Commit the changes
        conn.commit()
        
        print("Closing connection...")
        # Close the cursor and connection
        cur.close()
        conn.close()
        
        print("Tables created successfully")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False