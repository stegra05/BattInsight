"""Ziel & Funktion:
	•	Initialisiert die Datenbank: Erstellt die benötigten Tabellen (sofern nicht vorhanden) und führt den CSV-Datenimport durch.
Abhängigkeiten:
	•	Arbeitet mit database.py für die DB-Verbindung, models.py für die Tabellenstruktur und data_processor.py zur Datenverarbeitung.
"""

import os
import logging
import argparse
import hashlib
from flask import Flask, current_app
from pathlib import Path
from datetime import datetime

from database import init_db as init_database, create_tables, drop_tables, db_session, get_db_session
from data_processor import process_and_import_data
from utils import handle_error

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create a metadata table to track import information
from sqlalchemy import Column, Integer, String, DateTime, MetaData, Table
from database import Base

class ImportMetadata(Base):
    """SQLAlchemy model for tracking import metadata."""
    __tablename__ = 'import_metadata'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    file_path = Column(String, nullable=False)
    file_hash = Column(String, nullable=False)
    record_count = Column(Integer, nullable=False)
    import_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<ImportMetadata(id={self.id}, file_path='{self.file_path}', record_count={self.record_count})>"

def create_app_for_init():
    """Create a minimal Flask app for database initialization.
    
    Returns:
        Flask application instance.
    """
    app = Flask(__name__)
    
    # Configure the app with environment variables or defaults
    app.config.from_mapping(
        DATABASE_URI=os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/battinsight'),
        BATCH_SIZE=int(os.environ.get('BATCH_SIZE', 1000)),
        REFRESH_INTERVAL_HOURS=int(os.environ.get('REFRESH_INTERVAL_HOURS', 24))
    )
    
    return app

def calculate_file_hash(file_path):
    """Calculate SHA-256 hash of a file for fingerprinting.
    
    Args:
        file_path: Path to the file.
        
    Returns:
        String containing the hexadecimal digest of the file hash.
    """
    try:
        with open(file_path, 'rb') as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()
        return file_hash
    except Exception as e:
        handle_error(e, f"Error calculating hash for {file_path}")
        return None

def check_existing_import(file_path, file_hash):
    """Check if the file has already been imported with the same hash.
    
    Args:
        file_path: Path to the CSV file.
        file_hash: SHA-256 hash of the file.
        
    Returns:
        Tuple of (bool, int) indicating if the file was already imported and the record count.
    """
    try:
        with db_session() as session:
            # Query for the most recent import of this file
            metadata = session.query(ImportMetadata)\
                .filter(ImportMetadata.file_path == file_path)\
                .order_by(ImportMetadata.import_date.desc())\
                .first()
            
            if metadata and metadata.file_hash == file_hash:
                return True, metadata.record_count
            return False, 0
    except Exception as e:
        handle_error(e, "Error checking existing import")
        return False, 0

def record_import_metadata(file_path, file_hash, record_count):
    """Record metadata about the import for future reference.
    
    Args:
        file_path: Path to the CSV file.
        file_hash: SHA-256 hash of the file.
        record_count: Number of records imported.
    """
    try:
        with db_session() as session:
            metadata = ImportMetadata(
                file_path=file_path,
                file_hash=file_hash,
                record_count=record_count,
                import_date=datetime.utcnow()
            )
            session.add(metadata)
            # Commit happens automatically at the end of the context manager
    except Exception as e:
        handle_error(e, "Error recording import metadata")

def initialize_database(app, csv_file_path=None, force_recreate=False, batch_size=None):
    """Initialize database with CSV data.
    
    Args:
        app: Flask application instance
        csv_file_path: Path to CSV file
        force_recreate: Drop existing tables first
        batch_size: Number of records to insert in each batch
        
    Returns:
        Number of records imported
    """
    try:
        # Fix 1: Add configuration validation
        database_uri = app.config.get('SQLALCHEMY_DATABASE_URI', app.config.get('DATABASE_URI'))
        if not database_uri:
            raise ValueError("Database URI not configured")
            
        # Initialize database connection
        logger.info("Initializing database connection")
        init_database(app)
        
        # Fix 2: Add idempotency check
        if force_recreate:
            logger.info("Dropping existing tables")
            drop_tables()
            
        # Create tables
        logger.info("Creating database tables")
        create_tables()
        
        # Import data if a CSV file path is provided
        if csv_file_path:
            if not os.path.exists(csv_file_path):
                logger.error(f"CSV file not found: {csv_file_path}")
                return 0
            
            # Fix 3: Add data versioning check with fingerprinting
            file_hash = calculate_file_hash(csv_file_path)
            if file_hash:
                already_imported, record_count = check_existing_import(csv_file_path, file_hash)
                if already_imported and not force_recreate:
                    logger.info(f"File {csv_file_path} already imported with the same content. Skipping import.")
                    return record_count
            
            # Fix 4: Implement chunked processing
            if batch_size is None:
                batch_size = app.config.get('BATCH_SIZE', 1000)
                
            logger.info(f"Importing data from {csv_file_path} with batch size {batch_size}")
            total_imported = process_and_import_data(csv_file_path, batch_size=batch_size)
            
            # Fix 5: Add data fingerprint
            if file_hash and total_imported > 0:
                record_import_metadata(csv_file_path, file_hash, total_imported)
                logger.info(f"Data fingerprint: {file_hash}")
            
            return total_imported
        
        return 0
    except Exception as e:
        # Fix 6: Add proper error handling
        handle_error(e, "Error initializing database")
        raise

def init_db(csv_file_path=None, drop_existing=False, batch_size=1000):
    """Initialize the database by creating tables and optionally importing data.
    
    Args:
        csv_file_path: Path to the CSV file to import. If None, no data import is performed.
        drop_existing: If True, drop existing tables before creating new ones.
        batch_size: Number of records to insert in each batch during data import.
        
    Returns:
        Number of records imported, or 0 if no import was performed.
    """
    # Create a minimal Flask app for database initialization
    app = create_app_for_init()
    
    # Use the new initialize_database function
    return initialize_database(app, csv_file_path, drop_existing, batch_size)

def schedule_periodic_refresh(app):
    """Set up a scheduler for periodic database refreshes.
    
    Args:
        app: Flask application instance.
    """
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        
        # Find the default CSV path
        data_dir = Path(__file__).parent.parent / 'data'
        default_csv = data_dir / 'world_kpi_anonym.csv'
        csv_path = str(default_csv) if default_csv.exists() else None
        
        if not csv_path:
            logger.warning("No default CSV file found for periodic refresh.")
            return
        
        refresh_hours = app.config.get('REFRESH_INTERVAL_HOURS', 24)
        logger.info(f"Setting up periodic refresh every {refresh_hours} hours")
        
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            lambda: initialize_database(app, csv_path, force_recreate=False),
            'interval',
            hours=refresh_hours,
            id='db_refresh_job'
        )
        scheduler.start()
        
        # Add scheduler to app context for potential shutdown
        app.scheduler = scheduler
        
    except ImportError:
        logger.warning("APScheduler not installed. Periodic refresh not available.")
    except Exception as e:
        handle_error(e, "Error setting up periodic refresh")

def main():
    """Main function to run the database initialization script."""
    parser = argparse.ArgumentParser(description='Initialize the database and import data.')
    parser.add_argument('--csv', help='Path to the CSV file to import')
    parser.add_argument('--drop', action='store_true', help='Drop existing tables before creating new ones')
    parser.add_argument('--batch-size', type=int, default=1000, help='Number of records to insert in each batch')
    parser.add_argument('--schedule', action='store_true', help='Set up periodic database refresh')
    
    args = parser.parse_args()
    
    # Use default CSV path if not provided
    if not args.csv:
        # Try to find the CSV file in the data directory
        data_dir = Path(__file__).parent.parent / 'data'
        default_csv = data_dir / 'world_kpi_anonym.csv'
        
        if default_csv.exists():
            args.csv = str(default_csv)
            logger.info(f"Using default CSV file: {args.csv}")
        else:
            logger.warning("No CSV file specified and default file not found. No data will be imported.")
    
    # Initialize the database
    records_imported = init_db(args.csv, args.drop, args.batch_size)
    
    if records_imported > 0:
        logger.info(f"Database initialization completed successfully. Imported {records_imported} records.")
    else:
        logger.info("Database initialization completed successfully. No data was imported.")
    
    # Set up periodic refresh if requested
    if args.schedule:
        app = create_app_for_init()
        schedule_periodic_refresh(app)
        logger.info("Periodic refresh scheduled. Press Ctrl+C to exit.")
        
        # Keep the script running to allow the scheduler to work
        try:
            import time
            while True:
                time.sleep(60)
        except KeyboardInterrupt:
            logger.info("Shutting down scheduler")
            if hasattr(app, 'scheduler'):
                app.scheduler.shutdown()

# Add Flask CLI commands
def register_cli_commands(app):
    """Register CLI commands with the Flask application.
    
    Args:
        app: Flask application instance.
    """
    import click
    
    @app.cli.command("init-db")
    @click.option("--csv", help="Path to the CSV file to import")
    @click.option("--force", is_flag=True, help="Drop existing tables before creating new ones")
    @click.option("--batch-size", type=int, default=1000, help="Number of records to insert in each batch")
    def init_db_command(csv, force, batch_size):
        """Initialize the database and import data."""
        # Use default CSV path if not provided
        if not csv:
            data_dir = Path(__file__).parent.parent / 'data'
            default_csv = data_dir / 'world_kpi_anonym.csv'
            if default_csv.exists():
                csv = str(default_csv)
                click.echo(f"Using default CSV file: {csv}")
        
        records_imported = initialize_database(current_app, csv, force, batch_size)
        
        if records_imported > 0:
            click.echo(f"Database initialized successfully. Imported {records_imported} records.")
        else:
            click.echo("Database initialized successfully. No data was imported.")
    
    @app.cli.command("schedule-refresh")
    @click.option("--interval", type=int, help="Refresh interval in hours")
    def schedule_refresh_command(interval):
        """Set up periodic database refresh."""
        if interval:
            current_app.config['REFRESH_INTERVAL_HOURS'] = interval
        
        schedule_periodic_refresh(current_app)
        click.echo(f"Periodic refresh scheduled every {current_app.config.get('REFRESH_INTERVAL_HOURS', 24)} hours.")

if __name__ == '__main__':
    main()