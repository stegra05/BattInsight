#!/bin/bash
set -e

# Basisverzeichnis festlegen
BASE_DIR="battery-failure-visualization"

echo "Erstelle Projektstruktur im Verzeichnis: $BASE_DIR"

# Basisverzeichnis erstellen
mkdir -p "$BASE_DIR"

####################################
# Backend-Struktur erstellen
####################################
echo "Erstelle Backend-Struktur..."
mkdir -p "$BASE_DIR/backend/tests"

# Leere Dateien im Backend anlegen
touch "$BASE_DIR/backend/app.py"
touch "$BASE_DIR/backend/ai_query.py"
touch "$BASE_DIR/backend/database.py"
touch "$BASE_DIR/backend/models.py"
touch "$BASE_DIR/backend/init_db.py"
touch "$BASE_DIR/backend/data_processor.py"
touch "$BASE_DIR/backend/data_routes.py"
touch "$BASE_DIR/backend/filter_routes.py"
touch "$BASE_DIR/backend/utils.py"
touch "$BASE_DIR/backend/requirements.txt"
touch "$BASE_DIR/backend/tests/test_api.py"

####################################
# Frontend-Struktur erstellen
####################################
echo "Erstelle Frontend-Struktur..."
mkdir -p "$BASE_DIR/frontend/public"
mkdir -p "$BASE_DIR/frontend/src/components"
mkdir -p "$BASE_DIR/frontend/src/api"
mkdir -p "$BASE_DIR/frontend/src/styles"
mkdir -p "$BASE_DIR/frontend/tests"

# Leere Dateien im Frontend anlegen
touch "$BASE_DIR/frontend/public/index.html"
touch "$BASE_DIR/frontend/src/components/App.js"
touch "$BASE_DIR/frontend/src/components/HomePage.js"
touch "$BASE_DIR/frontend/src/components/DataVisualization.js"
touch "$BASE_DIR/frontend/src/components/Filter.js"
touch "$BASE_DIR/frontend/src/components/AIQuery.js"
touch "$BASE_DIR/frontend/src/api/apiClient.js"
touch "$BASE_DIR/frontend/src/index.js"
touch "$BASE_DIR/frontend/package.json"

####################################
# Docker-Struktur erstellen
####################################
echo "Erstelle Docker-Struktur..."
mkdir -p "$BASE_DIR/docker"

touch "$BASE_DIR/docker/Dockerfile.backend"
touch "$BASE_DIR/docker/Dockerfile.frontend"
touch "$BASE_DIR/docker/docker-compose.yml"

####################################
# Weitere Dateien im Basisverzeichnis
####################################
echo "Erstelle weitere Dateien..."
touch "$BASE_DIR/.env"
touch "$BASE_DIR/README.md"
touch "$BASE_DIR/Requirements Document.md"
touch "$BASE_DIR/LICENSE"

echo "Projektstruktur erfolgreich erstellt im Verzeichnis '$BASE_DIR'."