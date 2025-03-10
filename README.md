# BattInsight

Interactive platform to visualize battery data and identify anomalies across different regions and models.

## Overview

BattInsight is a fullstack application for visualizing battery data with filtering capabilities and AI-powered SQL query generation. The application allows users to analyze battery performance data across different regions, models, and climate conditions.

## Features

- **Data Visualization**: Interactive map and tabular views of battery data
- **Advanced Filtering**: Filter data by continent, country, climate, model series, and value ranges
- **AI-Powered Queries**: Natural language to SQL conversion using OpenAI API
- **Data Export**: Export filtered data in CSV, JSON, and Excel formats
- **Interactive Maps**: Visualize data geographically using Mapbox integration

## Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- Docker and Docker Compose
- PostgreSQL (or via Docker)

### Environment Configuration

The application uses environment variables for configuration. Create a `.env` file with the following variables:

```
# Database Configuration
DATABASE_URI=postgresql://postgres:postgres@postgres:5432/battinsight
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=battinsight

# API Keys
OPENAI_API_KEY=your_openai_api_key
MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Application Settings
SECRET_KEY=your_secret_key
FLASK_ENV=development
FLASK_DEBUG=1
```

### Docker Setup

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

### Local Development Setup

1. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   flask run
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Project Structure

```
battinsight/
├── backend/                       # Flask backend application
│   ├── api/                       # API endpoints and routes
│   ├── core/                      # Core application functionality
│   ├── services/                  # Business logic and services
│   ├── utils/                     # Utility functions and helpers
│   ├── tests/                     # Backend tests
│   └── logs/                      # Log files
│
├── frontend/                      # React frontend application
│   ├── public/                    # Static public assets
│   └── src/                       # Source code
│       ├── components/            # React components
│       ├── api/                   # API client
│       ├── hooks/                 # Custom React hooks
│       ├── context/               # React context providers
│       ├── utils/                 # Utility functions
│       ├── styles/                # CSS and styling
│       └── tests/                 # Frontend tests
│
├── docker/                        # Docker configuration
│   ├── scripts/                   # Docker helper scripts
│   ├── Dockerfile.backend         # Backend Dockerfile
│   ├── Dockerfile.frontend        # Frontend Dockerfile
│   ├── docker-compose.yml         # Docker Compose configuration
│   └── nginx.conf                 # Nginx configuration
│
├── data/                          # Data files
│   └── world_kpi_anonym.csv       # Battery data CSV
│
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   ├── architecture/              # Architecture diagrams
│   ├── user-guide/                # User guide
│   └── development-guide/         # Development guide
│
└── scripts/                       # Utility scripts
```

## Documentation

For more detailed information, please refer to the documentation in the `docs` directory:

- [API Documentation](docs/api/README.md)
- [Architecture Diagrams](docs/architecture/README.md)
- [User Guide](docs/user-guide/README.md)
- [Development Guide](docs/development-guide/README.md)

## Testing

Run tests with the provided test script:

```bash
./scripts/run_tests.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
