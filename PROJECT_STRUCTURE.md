# BattInsight Project Structure

This document outlines the refactored project structure for the BattInsight application.

## Directory Structure

```
battinsight/
├── backend/                 # Python Flask Backend
│   ├── filters/             # Filter-related functionality
│   ├── logs/                # Log files
│   ├── tests/               # Backend tests
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   ├── test_data_processor.py
│   │   ├── test_filters_utils.py
│   │   └── test_utils.py
│   ├── __init__.py
│   ├── ai_query.py          # AI query functionality
│   ├── app.py               # Main Flask application
│   ├── base.py              # Base classes
│   ├── data_processor.py    # Data processing functionality
│   ├── data_routes.py       # API routes for data
│   ├── database.py          # Database connection and utilities
│   ├── init_db.py           # Database initialization
│   ├── models.py            # SQLAlchemy models
│   ├── requirements.txt     # Backend dependencies
│   ├── setup.py             # Backend setup script
│   └── utils.py             # Utility functions
├── data/                    # Data files
│   └── world_kpi_anonym.csv # Sample data
├── docker/                  # Docker configuration
│   ├── scripts/             # Docker utility scripts
│   │   ├── check_container.py  # Container status check script
│   │   └── docker_utils.sh     # Docker utilities script
│   ├── docker-compose.yml   # Docker Compose configuration
│   ├── Dockerfile.backend   # Backend Dockerfile
│   └── Dockerfile.frontend  # Frontend Dockerfile
├── frontend/                # React Frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── api/             # API clients
│   │   ├── components/      # React components
│   │   └── styles/          # CSS files
│   ├── tests/               # Frontend tests
│   └── package.json         # Frontend dependencies
├── .env                     # Environment variables (not in version control)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── LICENSE                  # License file
├── README.md                # Project documentation
├── Requirements Document.md # Requirements documentation
└── setup.py                 # Project setup script
```

## Key Changes

1. **Consolidated Database Scripts**
   - Moved all database functionality into `backend/database.py`
   - Added Docker-specific database functions with a `docker_mode` parameter

2. **Organized Docker Scripts**
   - Created a `docker/scripts` directory for all Docker-related scripts
   - Consolidated multiple shell scripts into a single `docker_utils.sh` utility script

3. **Improved Documentation**
   - Updated README.md with clear setup instructions
   - Added a comprehensive project structure document
   - Created a template .env.example file

4. **Standardized Project Setup**
   - Updated setup.py with all necessary dependencies
   - Improved setup.sh script with clear instructions

## Usage

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/battinsight.git
cd battinsight

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .
```

### Docker

```bash
# Start Docker containers
./docker/scripts/docker_utils.sh restart

# Check container status
./docker/scripts/docker_utils.sh status

# View container logs
./docker/scripts/docker_utils.sh logs
```

### Local Development

```bash
# Start backend
cd backend
flask run

# Start frontend (in a separate terminal)
cd frontend
npm install
npm start
``` 