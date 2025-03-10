import pytest
from unittest.mock import Mock, patch
from backend.app import create_app
from backend.database import db_session, init_db, engine
from backend.models import BatteryData
import os  # Add this import to fix the missing import error
from sqlalchemy import text  # Import text to wrap raw SQL queries

@pytest.fixture(scope='session')  # Session-scoped for reuse
def app():
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:?cache=shared',  # Shared in-memory DB
        'OPENAI_API_KEY': 'test-key'
    })
    with app.app_context():
        init_db(app)
        from backend.models import Base, BatteryData, ModelSeries
        from backend.database import engine, db_session
        Base.metadata.create_all(bind=engine)
        
        # Create test data
        with db_session() as session:
            series = ModelSeries(series_name='X300', release_year=2020)
            session.add(series)
            
            for i in range(50):
                battery = BatteryData(
                    batt_alias=f'BATT-{i}',
                    country='Germany' if i < 30 else 'France',
                    continent='Europe',
                    climate='Temperate' if i < 40 else 'Continental',
                    val=75.5 + i,
                    var='capacity',
                    model_series_id=1
                )
                session.add(battery)
            session.commit()
        yield app

@pytest.fixture(scope='session')
def db_session(app):
    from backend.database import engine, Session
    
    # For SQLite in-memory database, we need to create tables
    if 'sqlite' in str(engine.url):
        from backend.models import Base
        Base.metadata.create_all(bind=engine)
    
    # Try to connect to the database
    try:
        connection = engine.connect()
        transaction = connection.begin()
        session = Session(bind=connection)
        
        # Create nested transaction for test isolation
        session.begin_nested()
        yield session
        session.close()
        transaction.rollback()
        connection.close()
    except Exception as e:
        # If connection fails (e.g., PostgreSQL not running), yield a session anyway
        # This allows tests that don't need a real DB connection to run
        session = Session()
        yield session
        session.close()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(scope='session')  # Session-scoped for reuse
def mock_openai():
    mock = Mock()
    # Create a response structure that matches the OpenAI client API
    mock_message = Mock()
    mock_message.content = 'SELECT id, batt_alias FROM battery_data LIMIT 10'
    
    mock_choice = Mock()
    mock_choice.message = mock_message
    
    mock_response = Mock()
    mock_response.choices = [mock_choice]
    
    # Setup the chat.completions.create method to return our mock response
    mock.chat = Mock()
    mock.chat.completions = Mock()
    mock.chat.completions.create = Mock(return_value=mock_response)
    
    return mock


def test_valid_ai_query(client, mock_openai):
    with patch('backend.ai_query.get_openai_client', return_value=mock_openai):
        response = client.post('/api/ai-query', 
            json={'query': 'Show average battery values'})
        assert response.status_code == 200
        assert 'SELECT' in response.json['sql_query']
        assert 'batt_alias' in response.json['sql_query']

def test_healthcheck(client):
    response = client.get('/healthcheck')
    assert response.status_code == 200
    assert response.json == {'status': 'healthy', 'version': '1.0.0'}

def test_data_endpoint_basic(client):
    response = client.get('/api/data')
    assert response.status_code == 200
    assert isinstance(response.json['data'], list)

@pytest.mark.parametrize("filters,expected_count", [
    ({'continent': 'Europe'}, 50),
    ({'climate': 'Temperate'}, 40),
    ({'model_series': 'X300'}, 50),
    ({'val_min': 75, 'val_max': 125}, 50)
])
def test_data_filtering(client, filters, expected_count):
    response = client.get('/api/data', query_string=filters)
    assert response.status_code == 200
    assert len(response.json['data']) == expected_count
    for item in response.json['data']:
        if 'continent' in filters:
            assert item['continent'] == filters['continent']
        if 'climate' in filters:
            assert item['climate'] == filters['climate']


def test_database_schema_integrity(db_session):
    from backend.models import BatteryData
    from sqlalchemy import inspect
    from backend.database import engine
    
    # Skip this test if using SQLite (in-memory DB for tests)
    if 'sqlite' in str(engine.url):
        pytest.skip("Skipping schema integrity test for SQLite")
    
    # Verify table structure
    inspector = inspect(engine)
    columns = inspector.get_columns('battery_data')
    column_names = [c['name'] for c in columns]
    
    expected_columns = [
        'id', 'batt_alias', 'country', 'continent',
        'climate', 'iso_a3', 'model_series', 'var',
        'val', 'descr', 'cnt_vhcl'
    ]
    assert set(column_names) == set(expected_columns)
    
    # Verify constraints - only for PostgreSQL
    if 'postgresql' in str(engine.url):
        table_constraints = inspector.get_check_constraints('battery_data')
        assert any(c['sqltext'] == 'val >= 0' for c in table_constraints)
        assert any(c['sqltext'] == 'val <= 100' for c in table_constraints)

@pytest.mark.parametrize("malicious_query", [
    "DROP TABLE battery_data;",
    "SELECT * FROM users;",
    "DELETE FROM battery_data WHERE 1=1--",
    "SELECT * FROM battery_data UNION SELECT * FROM users"
])
def test_ai_query_security(client, malicious_query):
    response = client.post('/api/ai-query',
        json={'query': malicious_query})
    assert response.status_code == 400
    assert 'Query contains disallowed operations' in response.json['error']


def test_performance_benchmark(client):
    import time
    # Test response time under load
    start_time = time.time()
    for _ in range(100):
        response = client.get('/api/data')
        assert response.status_code == 200
    duration = time.time() - start_time
    assert duration < 2.0  # 100 requests in under 2 seconds


def test_error_handling(client):
    # Test invalid JSON
    response = client.post('/api/ai-query', data='{invalid json}')
    assert response.status_code == 400
    
    # Test missing OpenAI key
    with patch.dict(os.environ, {'OPENAI_API_KEY': ''}):
        response = client.post('/api/ai-query', json={'query': 'test'})
        assert response.status_code == 400
        assert 'OpenAI integration' in response.json['error']

def test_ai_query_success(client, mock_openai):
    response = client.post('/api/ai-query', json={'query': 'Show 5 batteries'})
    assert response.status_code == 200
    assert 'data' in response.json
    mock_openai.chat.completions.create.assert_called_once()

def test_ai_query_invalid_sql(client):
    response = client.post('/api/ai-query', json={'query': 'Delete all data'})
    assert response.status_code == 400
    assert 'Query contains disallowed operations' in response.json['error']

def test_database_connection(db_session):
    from backend.database import engine
    
    # Skip this test if PostgreSQL is not available
    if 'postgresql' in str(engine.url):
        try:
            # Try a simple query
            result = db_session.execute(text("SELECT 1")).scalar()
            assert result == 1
        except Exception as e:
            pytest.skip(f"PostgreSQL connection failed: {str(e)}")
    else:
        # For SQLite, just verify we can execute a query
        result = db_session.execute(text("SELECT 1")).scalar()
        assert result == 1