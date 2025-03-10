import psycopg2

def create_tables():
    """Create the tables in the database."""
    try:
        print("Connecting to the database...")
        # Connect to the database
        conn = psycopg2.connect(
            host="postgres",
            database="battinsight",
            user="postgres",
            password="postgres"
        )
        
        print("Connected to the database")
        
        # Create a cursor
        cur = conn.cursor()
        
        print("Creating model_series table...")
        # Create the model_series table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS model_series (
            id SERIAL PRIMARY KEY,
            series_name VARCHAR(50) UNIQUE NOT NULL,
            release_year INTEGER,
            description TEXT,
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        )
        """)
        
        print("Creating battery_data table...")
        # Create the battery_data table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS battery_data (
            id SERIAL PRIMARY KEY,
            batt_alias VARCHAR(50) NOT NULL,
            country VARCHAR(100),
            continent VARCHAR(50),
            climate VARCHAR(50),
            iso_a3 VARCHAR(3),
            model_series_id INTEGER REFERENCES model_series(id),
            model_series INTEGER,
            var VARCHAR(50) NOT NULL,
            val FLOAT NOT NULL,
            descr VARCHAR(200),
            cnt_vhcl INTEGER,
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        )
        """)
        
        print("Creating indexes...")
        # Create indexes
        cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_batt_alias ON battery_data (batt_alias);
        CREATE INDEX IF NOT EXISTS idx_country ON battery_data (country);
        CREATE INDEX IF NOT EXISTS idx_continent ON battery_data (continent);
        CREATE INDEX IF NOT EXISTS idx_climate ON battery_data (climate);
        CREATE INDEX IF NOT EXISTS idx_iso_a3 ON battery_data (iso_a3);
        CREATE INDEX IF NOT EXISTS idx_model_series_id ON battery_data (model_series_id);
        CREATE INDEX IF NOT EXISTS idx_model_series ON battery_data (model_series);
        CREATE INDEX IF NOT EXISTS idx_var ON battery_data (var);
        CREATE INDEX IF NOT EXISTS idx_val_range ON battery_data (var, val);
        CREATE INDEX IF NOT EXISTS idx_location ON battery_data (country, continent, climate);
        """)
        
        print("Committing changes...")
        # Commit the changes
        conn.commit()
        
        print("Closing connection...")
        # Close the cursor and connection
        cur.close()
        conn.close()
        
        print("Tables created successfully")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

if __name__ == "__main__":
    print("Starting table creation...")
    create_tables()
    print("Table creation complete") 