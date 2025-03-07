#!/bin/bash

# Function to log and print messages
log() {
  echo -e "\033[1;34m[INFO] $1\033[0m"
}

# 1. Clean Unnecessary Files/Directories
log "Cleaning up unnecessary files and directories..."
rm -rf backend/__pycache__
rm -rf backend/venv
rm -rf frontend/node_modules
rm -rf frontend/build
rm -f *.log

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

# 3. Restructure the backend
log "Restructuring backend..."
mkdir -p backend/models backend/routes backend/services backend/tests

# List of files to move into specific folders
FILES_TO_MOVE=("backend/models.py" "backend/config.py" "backend/database.py")

for file in "${FILES_TO_MOVE[@]}"; do
  if [[ -f "$file" ]]; then
    mv "$file" backend/models/
    log "Moved $file to backend/models/"
  else
    log "File $file does not exist, skipping..."
  fi
done

log "Cleanup and restructuring complete!"