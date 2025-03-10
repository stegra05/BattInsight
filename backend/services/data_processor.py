"""
Data processing service for BattInsight.
"""
import os
import logging
import pandas as pd
from sqlalchemy import func
from backend.core.database import get_db_session
from backend.core.models import BatteryData, ModelSeries

# Configure logging
logger = logging.getLogger(__name__)

def process_csv_data(csv_file_path):
    """Process CSV data from file.
    
    Args:
        csv_file_path: Path to CSV file
        
    Returns:
        Processed DataFrame
    """
    try:
        # Read CSV file
        df = pd.read_csv(csv_file_path)
        
        # Log data shape
        logger.info(f"Read CSV file with shape: {df.shape}")
        
        # Clean column names (lowercase, strip spaces)
        df.columns = [col.strip().lower() for col in df.columns]
        
        # Rename columns if needed
        column_mapping = {
            'battalias': 'batt_alias',  # Fix column name mismatch
            'iso_a3_code': 'iso_a3',
            'model_series_id': 'model_series',
            'value': 'val',
            'description': 'descr',
            'vehicle_count': 'cnt_vhcl'
        }
        
        # Apply column mapping for columns that exist
        for old_col, new_col in column_mapping.items():
            if old_col in df.columns:
                df = df.rename(columns={old_col: new_col})
        
        # Fill missing values
        df['batt_alias'] = df['batt_alias'].fillna('unknown')
        df['country'] = df['country'].fillna('unknown')
        df['continent'] = df['continent'].fillna('unknown')
        df['climate'] = df['climate'].fillna('unknown')
        df['iso_a3'] = df['iso_a3'].fillna('XXX')
        df['var'] = df['var'].fillna('unknown')
        df['descr'] = df['descr'].fillna('')
        
        # Convert numeric columns
        df['val'] = pd.to_numeric(df['val'], errors='coerce')
        df['cnt_vhcl'] = pd.to_numeric(df['cnt_vhcl'], errors='coerce')
        
        # Fill numeric missing values
        df['val'] = df['val'].fillna(0)
        df['cnt_vhcl'] = df['cnt_vhcl'].fillna(0)
        
        # Ensure model_series is integer
        df['model_series'] = pd.to_numeric(df['model_series'], errors='coerce').fillna(0).astype(int)
        
        return df
    
    except Exception as e:
        logger.error(f"Error processing CSV data: {str(e)}")
        raise

def dataframe_to_models(df):
    """Convert DataFrame to model instances.
    
    Args:
        df: Processed DataFrame
        
    Returns:
        List of BatteryData instances
    """
    try:
        # Convert DataFrame to list of dictionaries
        records = df.to_dict('records')
        
        # Convert to model instances
        battery_data = []
        for record in records:
            # Create BatteryData instance
            data = BatteryData(
                batt_alias=record['batt_alias'],
                country=record['country'],
                continent=record['continent'],
                climate=record['climate'],
                iso_a3=record['iso_a3'],
                model_series=record['model_series'],
                var=record['var'],
                val=record['val'],
                descr=record['descr'],
                cnt_vhcl=record['cnt_vhcl']
            )
            
            battery_data.append(data)
        
        return battery_data
    
    except Exception as e:
        logger.error(f"Error converting DataFrame to models: {str(e)}")
        raise

def import_data_to_db(battery_data):
    """Import battery data to database.
    
    Args:
        battery_data: List of BatteryData instances
        
    Returns:
        Dictionary with import results
    """
    try:
        with get_db_session() as session:
            # Check if model series exist
            model_series_ids = set([data.model_series for data in battery_data])
            existing_model_series = session.query(ModelSeries.id).filter(ModelSeries.id.in_(model_series_ids)).all()
            existing_model_series_ids = set([ms.id for ms in existing_model_series])
            
            # Create missing model series
            missing_model_series_ids = model_series_ids - existing_model_series_ids
            for ms_id in missing_model_series_ids:
                model_series = ModelSeries(
                    id=ms_id,
                    series_name=f"Series {ms_id}",
                    release_year=2020  # Default value
                )
                session.add(model_series)
            
            # Commit model series
            session.commit()
            
            # Add battery data
            session.add_all(battery_data)
            session.commit()
            
            return {
                'records_imported': len(battery_data),
                'model_series_created': len(missing_model_series_ids)
            }
    
    except Exception as e:
        logger.error(f"Error importing data to database: {str(e)}")
        raise

def process_and_import_data(csv_file_path):
    """Process and import data from CSV file.
    
    Args:
        csv_file_path: Path to CSV file
        
    Returns:
        Dictionary with import results
    """
    try:
        # Process CSV data
        df = process_csv_data(csv_file_path)
        
        # Convert to model instances
        battery_data = dataframe_to_models(df)
        
        # Import to database
        result = import_data_to_db(battery_data)
        
        logger.info(f"Data import completed: {result}")
        
        return result
    
    except Exception as e:
        logger.error(f"Error processing and importing data: {str(e)}")
        raise
