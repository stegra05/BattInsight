import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_db_connection():
    """Test if the database connection is working."""
    try:
        # Create a database engine
        engine = create_engine(
            'postgresql://postgres:postgres@localhost:5432/battinsight',
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
        
        # Try connecting to the Docker container
        try:
            print("Trying to connect to the Docker container...")
            engine = create_engine(
                'postgresql://postgres:postgres@postgres:5432/battinsight',
                pool_pre_ping=True,
                pool_recycle=3600,
                echo=True
            )
            
            # Create a session factory
            Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            
            # Create a session
            session = Session()
            
            # Test the connection
            result = session.execute(text("SELECT 1"))
            print(f"Docker container connection test result: {result.scalar()}")
            
            # Close the session
            session.close()
            
            return True
        except Exception as e2:
            print(f"Docker container connection test failed: {e2}")
            return False

if __name__ == "__main__":
    test_db_connection() 