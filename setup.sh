#!/bin/bash

# Setze den Projektnamen
PROJECT_NAME="battery-failure-visualization"

# Stelle sicher, dass das Skript im aktuellen Verzeichnis arbeitet
mkdir -p "$PROJECT_NAME"

# Wechsle in das Projektverzeichnis
cd "$PROJECT_NAME" || exit

# Erstelle die Verzeichnisstruktur
mkdir -p backend/routes
mkdir -p backend/services
mkdir -p backend/tests
mkdir -p frontend/public
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/api
mkdir -p frontend/src/utils
mkdir -p data
mkdir -p docker

# Erstelle Backend-Dateien
touch backend/app.py
touch backend/models.py
touch backend/database.py
touch backend/config.py
touch backend/requirements.txt
touch backend/init_db.py
touch backend/routes/__init__.py
touch backend/routes/data_routes.py
touch backend/routes/filter_routes.py
touch backend/services/__init__.py
touch backend/services/data_processor.py

# Erstelle Frontend-Dateien
touch frontend/package.json
touch frontend/tailwind.config.js
touch frontend/src/App.js
touch frontend/src/index.js

# Erstelle Datenverzeichnis-Dateien
touch data/battery_failures.csv
touch data/processed_data.json

# Erstelle Docker-Setup-Dateien
touch docker/Dockerfile
touch docker/docker-compose.yml

# Erstelle Root-Level Dateien
touch .gitignore
touch README.md
touch LICENSE

# Erfolgsmeldung
echo "Projektstruktur für '$PROJECT_NAME' wurde erfolgreich erstellt!"