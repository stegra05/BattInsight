#!/bin/bash

# Function to log and print messages
log() {
  echo -e "\033[1;34m[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1\033[0m"
}
error() {
  echo -e "\033[1;31m[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1\033[0m"
}

# 1. Clean Unnecessary Files/Directories
BACKUP_BEFORE_DELETE=false
while getopts "b" flag; do
  case "${flag}" in
    b) BACKUP_BEFORE_DELETE=true ;;
  esac
done
log "Cleaning up unnecessary files and directories..."
if $BACKUP_BEFORE_DELETE; then
  tar -czf backup.tar.gz backend/__pycache__ backend/venv backend/static frontend/node_modules frontend/build || log "Backup failed, proceeding with cleanup."
  log "Backup created successfully (backup.tar.gz)."
fi
rm -rf backend/__pycache__
rm -rf backend/venv/
rm -rf backend/static/
rm -rf frontend/node_modules
rm -rf frontend/build
add text after this line
docker_cleanup() {
  log "Cleaning up orphaned Docker containers, images, and dangling volumes..."
  docker system prune -f --volumes
  log "Docker cleanup complete."
}
docker_cleanup

rm -f *.tmp
log "Checking JSON validity in data folder..."
for json_file in data/*.json; do
  if ! jq empty "$json_file" 2>/dev/null; then
    error "Invalid JSON file: $json_file"
  else
    log "Valid JSON file: $json_file"
  fi
done
rm -f *.bak
rm -rf .DS_Store

# 2. Add `.gitignore`
log "Generating .gitignore file..."
cat <<EOL > .gitignore
__pycache__/
node_modules/
*.pyc
.venv/
build/
*.log
*.env
Dockerfile
EOL
log "Added .gitignore to workspace."

log "Checking if frontend has outdated build artifacts..."
if find frontend/build -type f -mtime +7 | grep -q .; then
  error "Frontend build artifacts are older than one week. A rebuild might be necessary."
else
  log "Frontend build artifacts checked. No outdated files found."
fi

# 3. Restructure the backend
log "Restructuring backend..."
mkdir -p backend/models backend/routes backend/services backend/tests backend/static

# List of files to move into specific folders
FILES_TO_MOVE=("backend/models.py" "backend/config.py" "backend/database.py" "backend/utils.py")

for file in "${FILES_TO_MOVE[@]}" "backend/helpers.py"; do
  if [[ -f "$file" ]]; then
    mv "$file" backend/models/
    log "Moved $file to backend/models/"
  else
    log "File $file does not exist, skipping..."
  fi
done
log "Moving necessary files complete."
log "Cleaning up generated database files..."
if [[ -f backend/battery_failure.db ]]; then
  log "Database file found: backend/battery_failure.db"
  log "Skipping removal of database files for now. You can enable it manually."
else
  log "No database files to clean up."
fi

SUMMARY=()
log "Cleanup, generating .gitignore, and restructuring complete! All tasks successfully executed."
SUMMARY+=("Cleanup successful.")
log "Summary of actions performed:"
for item in "${SUMMARY[@]}"; do
  log "$item"
done
