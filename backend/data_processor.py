"""Ziel & Funktion:
	•	Liest die CSV-Datei ein, bereinigt und transformiert die Daten (z. B. Entfernen von Leerzeichen, Normalisierung von Feldnamen) und bereitet sie für den Import in die Datenbank vor.
Abhängigkeiten:
	•	Nutzt Funktionen aus utils.py für wiederkehrende Aufgaben und arbeitet eng mit models.py und database.py zusammen, um die Daten zu speichern.
"""

import os
import logging
import pandas as pd
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from utils import read_csv_file, clean_dataframe, validate_dataframe, handle_error
from models import BatteryData
from database import db_session

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define required columns based on the CSV structure
REQUIRED_COLUMNS = [
    'battalias', 'country', 'continent', 'climate', 'iso_a3',
    'model_series', 'var', 'val', 'descr', 'cnt_vhcl'
]

def process_csv_data(file_path: str, delimiter: str = ';') -> pd.DataFrame:
    """Process CSV data by reading, cleaning, and validating it.
    
    Args:
        file_path: Path to the CSV file.
        delimiter: Delimiter used in the CSV file.
        
    Returns:
        Processed pandas DataFrame ready for database import.
        
    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the DataFrame is missing required columns.
    """
    try:
        # Read CSV file
        df = read_csv_file(file_path, delimiter)
        
        # Clean the DataFrame
        df_clean = clean_dataframe(df)
        
        # Validate the DataFrame
        validate_dataframe(df_clean, REQUIRED_COLUMNS)
        
        logger.info(f"Successfully processed CSV data with {len(df_clean)} rows")
        return df_clean
    except Exception as e:
        handle_error(e, "Error processing CSV data")
        raise

def dataframe_to_models(df: pd.DataFrame) -> List[BatteryData]:
    """Convert DataFrame rows to BatteryData model instances.
    
    Args:
        df: Processed pandas DataFrame.
        
    Returns:
        List of BatteryData model instances.
    """
    logger.info("Converting DataFrame to model instances")
    
    battery_data_list = []
    
    for _, row in df.iterrows():
        try:
            # Convert model_series, val, and cnt_vhcl to appropriate types
            model_series = int(row['model_series']) if pd.notna(row['model_series']) else None
            val = float(row['val']) if pd.notna(row['val']) else 0.0
            cnt_vhcl = int(row['cnt_vhcl']) if pd.notna(row['cnt_vhcl']) else None
            
            # Create BatteryData instance
            battery_data = BatteryData(
                batt_alias=row['battalias'],
                country=row['country'] if pd.notna(row['country']) else None,
                continent=row['continent'] if pd.notna(row['continent']) else None,
                climate=row['climate'] if pd.notna(row['climate']) else None,
                iso_a3=row['iso_a3'] if pd.notna(row['iso_a3']) else None,
                model_series=model_series,
                var=row['var'],
                val=val,
                descr=row['descr'] if pd.notna(row['descr']) else None,
                cnt_vhcl=cnt_vhcl
            )
            
            battery_data_list.append(battery_data)
        except Exception as e:
            logger.warning(f"Error converting row to model: {e}. Row: {row}")
            # Continue with next row instead of failing the entire process
            continue
    
    logger.info(f"Successfully converted {len(battery_data_list)} rows to model instances")
    return battery_data_list

def import_data_to_db(data_list: List[BatteryData], batch_size: int = 1000) -> int:
    """Import BatteryData instances to the database.
    
    Args:
        data_list: List of BatteryData model instances.
        batch_size: Number of records to insert in each batch.
        
    Returns:
        Number of records successfully imported.
    """
    logger.info(f"Importing {len(data_list)} records to database")
    
    total_imported = 0
    
    # Process in batches to avoid memory issues with large datasets
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i:i+batch_size]
        
        try:
            with db_session() as session:
                session.add_all(batch)
                # Commit happens automatically at the end of the context manager
            
            total_imported += len(batch)
            logger.info(f"Imported batch {i//batch_size + 1}, progress: {total_imported}/{len(data_list)}")
        except Exception as e:
            handle_error(e, f"Error importing batch {i//batch_size + 1}")
            # Continue with next batch instead of failing the entire process
            continue
    
    logger.info(f"Successfully imported {total_imported} records to database")
    return total_imported

def process_and_import_data(file_path: str, delimiter: str = ';', batch_size: int = 1000) -> int:
    """Process CSV data and import it to the database.
    
    Args:
        file_path: Path to the CSV file.
        delimiter: Delimiter used in the CSV file.
        batch_size: Number of records to insert in each batch.
        
    Returns:
        Number of records successfully imported.
        
    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the DataFrame is missing required columns.
    """
    try:
        # Process CSV data
        df = process_csv_data(file_path, delimiter)
        
        # Convert DataFrame to model instances
        data_list = dataframe_to_models(df)
        
        # Import data to database
        total_imported = import_data_to_db(data_list, batch_size)
        
        return total_imported
    except Exception as e:
        handle_error(e, "Error in process_and_import_data")
        raise