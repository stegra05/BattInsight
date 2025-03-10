import pytest
import pandas as pd
import os
from unittest.mock import patch, mock_open
from backend.data_processor import process_csv_data, dataframe_to_models, REQUIRED_COLUMNS
from backend.models import BatteryData

@pytest.fixture
def sample_csv_content():
    """Sample CSV content for testing."""
    return (
        "battalias;country;continent;climate;iso_a3;model_series;var;val;descr;cnt_vhcl\n"
        "BATT-001;Germany;Europe;Temperate;DEU;1;capacity;85.5;Test battery;100\n"
        "BATT-002;France;Europe;Temperate;FRA;1;capacity;82.3;Another battery;150\n"
        "BATT-003;Spain;Europe;Mediterranean;ESP;2;capacity;79.8;Third battery;120\n"
    )

@pytest.fixture
def sample_dataframe():
    """Sample DataFrame for testing."""
    return pd.DataFrame({
        'battalias': ['BATT-001', 'BATT-002', 'BATT-003'],
        'country': ['Germany', 'France', 'Spain'],
        'continent': ['Europe', 'Europe', 'Europe'],
        'climate': ['Temperate', 'Temperate', 'Mediterranean'],
        'iso_a3': ['DEU', 'FRA', 'ESP'],
        'model_series': [1, 1, 2],
        'var': ['capacity', 'capacity', 'capacity'],
        'val': [85.5, 82.3, 79.8],
        'descr': ['Test battery', 'Another battery', 'Third battery'],
        'cnt_vhcl': [100, 150, 120]
    })

def test_process_csv_data_success(sample_csv_content):
    """Test successful CSV data processing."""
    with patch('os.path.exists', return_value=True), \
         patch('os.path.getsize', return_value=1000), \
         patch('builtins.open', mock_open(read_data=sample_csv_content)), \
         patch('backend.data_processor.read_csv_file', return_value=pd.read_csv(
             pd.io.common.StringIO(sample_csv_content), delimiter=';')):
        
        result = process_csv_data('dummy_path.csv')
        
        assert isinstance(result, pd.DataFrame)
        assert len(result) == 3
        assert all(col in result.columns for col in REQUIRED_COLUMNS)
        assert result['val'].min() >= 0

def test_process_csv_data_file_too_large():
    """Test handling of files that are too large."""
    with patch('os.path.exists', return_value=True), \
         patch('os.path.getsize', return_value=101 * 1024 * 1024):
        
        with pytest.raises(ValueError, match="File exceeds maximum size"):
            process_csv_data('dummy_path.csv')

def test_process_csv_data_missing_columns(sample_csv_content):
    """Test handling of CSV files with missing required columns."""
    # Create CSV content with missing columns
    incomplete_csv = "battalias;country;continent;climate;iso_a3;model_series;var;val\n" \
                     "BATT-001;Germany;Europe;Temperate;DEU;1;capacity;85.5\n"
    
    with patch('os.path.exists', return_value=True), \
         patch('os.path.getsize', return_value=1000), \
         patch('builtins.open', mock_open(read_data=incomplete_csv)), \
         patch('backend.data_processor.read_csv_file', return_value=pd.read_csv(
             pd.io.common.StringIO(incomplete_csv), delimiter=';')):
        
        with pytest.raises(ValueError, match="missing required columns"):
            process_csv_data('dummy_path.csv')

def test_process_csv_data_negative_values(sample_csv_content):
    """Test handling of CSV files with negative values."""
    # Create CSV content with negative values
    negative_csv = "battalias;country;continent;climate;iso_a3;model_series;var;val;descr;cnt_vhcl\n" \
                   "BATT-001;Germany;Europe;Temperate;DEU;1;capacity;-85.5;Test battery;100\n"
    
    with patch('os.path.exists', return_value=True), \
         patch('os.path.getsize', return_value=1000), \
         patch('builtins.open', mock_open(read_data=negative_csv)), \
         patch('backend.data_processor.read_csv_file', return_value=pd.read_csv(
             pd.io.common.StringIO(negative_csv), delimiter=';')):
        
        with pytest.raises(ValueError, match="Negative values found"):
            process_csv_data('dummy_path.csv')

def test_dataframe_to_models(sample_dataframe):
    """Test conversion of DataFrame to model instances."""
    models = dataframe_to_models(sample_dataframe)
    
    assert len(models) == 3
    assert all(isinstance(model, BatteryData) for model in models)
    
    # Check first model attributes
    assert models[0].batt_alias == 'BATT-001'
    assert models[0].country == 'Germany'
    assert models[0].continent == 'Europe'
    assert models[0].climate == 'Temperate'
    assert models[0].iso_a3 == 'DEU'
    assert models[0].model_series == 1
    assert models[0].var == 'capacity'
    assert models[0].val == 85.5
    assert models[0].descr == 'Test battery'
    assert models[0].cnt_vhcl == 100