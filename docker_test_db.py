import psycopg2

def test_db_connection():
    """Test if the database connection is working."""
    try:
        # Connect to the database
        conn = psycopg2.connect(
            host="postgres",
            database="battinsight",
            user="postgres",
            password="postgres"
        )
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute a query
        cur.execute("SELECT 1")
        
        # Fetch the result
        result = cur.fetchone()
        print(f"Database connection test result: {result[0]}")
        
        # Close the cursor and connection
        cur.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"Database connection test failed: {e}")
        return False

if __name__ == "__main__":
    test_db_connection() 