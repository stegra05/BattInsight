"""Ziel & Funktion:
	•	Enthält gemeinsame Hilfsfunktionen, wie z. B. CSV-Import-Methoden, Logging, Fehlerbehandlung oder andere wiederkehrende Aufgaben.
Abhängigkeiten:
	•	Wird von data_processor.py und eventuell anderen Modulen im Backend genutzt.
"""

import os
import logging
import pandas as pd
from typing import List, Dict, Any, Union, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def read_csv_file(file_path: str, delimiter: str = ';') -> pd.DataFrame:
    """Read a CSV file and return a pandas DataFrame.
    
    Args:
        file_path: Path to the CSV file.
        delimiter: Delimiter used in the CSV file.
        
    Returns:
        pandas DataFrame containing the CSV data.
        
    Raises:
        FileNotFoundError: If the file does not exist.
        pd.errors.EmptyDataError: If the file is empty.
        pd.errors.ParserError: If the file cannot be parsed.
    """
    try:
        logger.info(f"Reading CSV file: {file_path}")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        df = pd.read_csv(file_path, delimiter=delimiter)
        logger.info(f"Successfully read CSV file with {len(df)} rows and {len(df.columns)} columns")
        return df
    except FileNotFoundError as e:
        logger.error(f"File not found: {file_path}")
        raise e
    except pd.errors.EmptyDataError as e:
        logger.error(f"Empty CSV file: {file_path}")
        raise e
    except pd.errors.ParserError as e:
        logger.error(f"Error parsing CSV file: {file_path}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error reading CSV file: {file_path}, error: {str(e)}")
        raise e

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Clean a pandas DataFrame by removing whitespace, normalizing field names, etc.
    
    Args:
        df: pandas DataFrame to clean.
        
    Returns:
        Cleaned pandas DataFrame.
    """
    logger.info("Cleaning DataFrame")
    
    # Make a copy to avoid modifying the original
    df_clean = df.copy()
    
    # Strip whitespace from string columns
    for col in df_clean.select_dtypes(include=['object']).columns:
        df_clean[col] = df_clean[col].str.strip() if df_clean[col].dtype == 'object' else df_clean[col]
    
    # Replace empty strings with None/NaN
    df_clean = df_clean.replace('', pd.NA)
    
    # Convert column names to snake_case
    df_clean.columns = [col.lower().replace(' ', '_') for col in df_clean.columns]
    
    logger.info("DataFrame cleaning completed")
    return df_clean

def validate_dataframe(df: pd.DataFrame, required_columns: List[str]) -> bool:
    """Validate that a DataFrame contains all required columns.
    
    Args:
        df: pandas DataFrame to validate.
        required_columns: List of column names that must be present.
        
    Returns:
        True if the DataFrame is valid, False otherwise.
        
    Raises:
        ValueError: If the DataFrame is missing required columns.
    """
    logger.info("Validating DataFrame")
    
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        error_msg = f"DataFrame is missing required columns: {', '.join(missing_columns)}"
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    logger.info("DataFrame validation successful")
    return True

def handle_error(context: str, error: Exception) -> bool:
    """Handle errors in a consistent way across the application.
    
    Args:
        context: Additional context about where the error occurred.
        error: The exception that occurred.
        
    Returns:
        bool: Always returns False to indicate an error occurred.
    """
    error_message = f"{str(error)}: {context}" if context else str(error)
    logger.error(f"Error occurred: {error_message}")
    
    # Additional error handling logic can be added here
    # For example, sending notifications, writing to error log files, etc.
    
    return False