import pytest
import pandas as pd
import os
from unittest.mock import patch, mock_open
from backend.utils import read_csv_file, clean_dataframe, validate_dataframe, handle_error

@pytest.fixture
def sample_csv_content():
    """Sample CSV content for testing."""
    return (
        "BattAlias;Country;Continent;Climate;ISO_A3;Model_Series;Var;Val;Descr;Cnt_Vhcl\n"
        "BATT-001;Germany;Europe;Temperate;DEU;1;capacity;85.5;Test battery;100\n"
        "BATT-002;France;Europe;Temperate;FRA;1;capacity;82.3;Another battery;150\n"
        "BATT-003;Spain;Europe;Mediterranean;ESP;2;capacity;79.8;Third battery;120\n"
    )

@pytest.fixture
def sample_dataframe():
    """Sample DataFrame for testing."""
    return pd.DataFrame({
        'BattAlias': ['BATT-001', 'BATT-002', 'BATT-003'],
        'Country': ['Germany', 'France', 'Spain'],
        'Continent': ['Europe', 'Europe', 'Europe'],
        'Climate': ['Temperate', 'Temperate', 'Mediterranean'],
        'ISO_A3': ['DEU', 'FRA', 'ESP'],
        'Model_Series': [1, 1, 2],
        'Var': ['capacity', 'capacity', 'capacity'],
        'Val': [85.5, 82.3, 79.8],
        'Descr': ['Test battery', 'Another battery', 'Third battery'],
        'Cnt_Vhcl': [100, 150, 120]
    })

def test_read_csv_file(sample_csv_content):
    """Test reading a CSV file."""
    with patch('os.path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data=sample_csv_content)):
        
        with patch('pandas.read_csv', return_value=pd.read_csv(
                pd.io.common.StringIO(sample_csv_content), delimiter=';')) as mock_read_csv:
            
            result = read_csv_file('dummy_path.csv')
            
            # Verify pandas.read_csv was called with correct parameters
            mock_read_csv.assert_called_once()
            assert mock_read_csv.call_args[0][0] == 'dummy_path.csv'
            assert mock_read_csv.call_args[1]['delimiter'] == ';'
            
            # Verify result
            assert isinstance(result, pd.DataFrame)
            assert len(result) == 3

def test_read_csv_file_not_found():
    """Test handling of file not found error."""
    with patch('os.path.exists', return_value=False):
        with pytest.raises(FileNotFoundError, match="File not found"):
            read_csv_file('nonexistent_file.csv')

def test_read_csv_file_empty():
    """Test handling of empty CSV file."""
    with patch('os.path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data="")), \
         patch('pandas.read_csv', side_effect=pd.errors.EmptyDataError):
        
        with pytest.raises(pd.errors.EmptyDataError):
            read_csv_file('empty_file.csv')

def test_read_csv_file_parser_error():
    """Test handling of CSV parser error."""
    with patch('os.path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data="invalid,csv,content")), \
         patch('pandas.read_csv', side_effect=pd.errors.ParserError):
        
        with pytest.raises(pd.errors.ParserError):
            read_csv_file('invalid_file.csv')

def test_clean_dataframe(sample_dataframe):
    """Test cleaning a DataFrame."""
    # Add some dirty data
    dirty_df = sample_dataframe.copy()
    dirty_df['Country'] = dirty_df['Country'].str.pad(10)
    dirty_df['Descr'] = dirty_df['Descr'].replace('Test battery', '')
    
    # Clean the DataFrame
    clean_df = clean_dataframe(dirty_df)
    
    # Verify cleaning operations
    assert clean_df.columns[0] == 'battalias'  # Column names converted to lowercase
    assert clean_df['country'][0] == 'Germany'  # Whitespace stripped
    assert pd.isna(clean_df['descr'][0])  # Empty string replaced with NaN

def test_validate_dataframe_valid(sample_dataframe):
    """Test validating a valid DataFrame."""
    # Convert column names to lowercase to match required columns
    df = sample_dataframe.copy()
    df.columns = [col.lower() for col in df.columns]
    
    required_columns = ['battalias', 'country', 'continent', 'climate', 'iso_a3', 'model_series', 'var', 'val']
    
    # Should not raise an exception
    result = validate_dataframe(df, required_columns)
    assert result is True

def test_validate_dataframe_missing_columns(sample_dataframe):
    """Test validating a DataFrame with missing required columns."""
    # Drop a required column
    df = sample_dataframe.copy()
    df = df.drop(columns=['Country'])
    df.columns = [col.lower() for col in df.columns]
    
    required_columns = ['battalias', 'country', 'continent', 'climate']
    
    with pytest.raises(ValueError, match="missing required columns"):
        validate_dataframe(df, required_columns)

def test_handle_error():
    """Test error handling function."""
    from backend.utils import handle_error
    import logging
    
    # Test with real logger instead of mock
    error = ValueError("Test error message")
    # The function should log the error but not raise it
    result = handle_error("Test operation", error)
    assert result is False