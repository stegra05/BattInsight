"""Ziel & Funktion:
	•	Initialisiert die Datenbank: Erstellt die benötigten Tabellen (sofern nicht vorhanden) und führt den CSV-Datenimport durch.
Abhängigkeiten:
	•	Arbeitet mit database.py für die DB-Verbindung, models.py für die Tabellenstruktur und data_processor.py zur Datenverarbeitung.
"""

import os
import logging
import argparse
from flask import Flask
from pathlib import Path

from database import init_db as init_database, create_tables, drop_tables
from data_processor import process_and_import_data
from utils import handle_error

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app_for_init():
    """Create a minimal Flask app for database initialization.
    
    Returns:
        Flask application instance.
    """
    app = Flask(__name__)
    
    # Configure the app with environment variables or defaults
    app.config.from_mapping(
        DATABASE_URI=os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/battinsight')
    )
    
    return app

def init_db(csv_file_path=None, drop_existing=False, batch_size=1000):
    """Initialize the database by creating tables and optionally importing data.
    
    Args:
        csv_file_path: Path to the CSV file to import. If None, no data import is performed.
        drop_existing: If True, drop existing tables before creating new ones.
        batch_size: Number of records to insert in each batch during data import.
        
    Returns:
        Number of records imported, or 0 if no import was performed.
    """
    try:
        # Create a minimal Flask app for database initialization
        app = create_app_for_init()
        
        # Initialize database connection
        logger.info("Initializing database connection")
        init_database(app)
        
        # Drop existing tables if requested
        if drop_existing:
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
                
            logger.info(f"Importing data from {csv_file_path}")
            return process_and_import_data(csv_file_path, batch_size=batch_size)
        
        return 0
    except Exception as e:
        handle_error(e, "Error initializing database")
        raise

def main():
    """Main function to run the database initialization script."""
    parser = argparse.ArgumentParser(description='Initialize the database and import data.')
    parser.add_argument('--csv', help='Path to the CSV file to import')
    parser.add_argument('--drop', action='store_true', help='Drop existing tables before creating new ones')
    parser.add_argument('--batch-size', type=int, default=1000, help='Number of records to insert in each batch')
    
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

if __name__ == '__main__':
    main()