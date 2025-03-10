#!/bin/bash

# Setup environment script for BattInsight

# Check if .env file exists
if [ -f .env ]; then
    echo "An .env file already exists. Do you want to overwrite it? (y/n)"
    read -r answer
    if [ "$answer" != "y" ]; then
        echo "Setup cancelled. Your existing .env file was not modified."
        exit 0
    fi
fi

# Copy example file
cp .env.example .env

echo "Environment file (.env) has been created from template."
echo "Please edit the .env file to add your specific configuration values."

# Optional: Open the file in an editor if available
if command -v code >/dev/null 2>&1; then
    echo "Would you like to open the .env file in VS Code now? (y/n)"
    read -r open_answer
    if [ "$open_answer" = "y" ]; then
        code .env
    fi
elif command -v nano >/dev/null 2>&1; then
    echo "Would you like to open the .env file in nano now? (y/n)"
    read -r open_answer
    if [ "$open_answer" = "y" ]; then
        nano .env
    fi
elif command -v vim >/dev/null 2>&1; then
    echo "Would you like to open the .env file in vim now? (y/n)"
    read -r open_answer
    if [ "$open_answer" = "y" ]; then
        vim .env
    fi
fi

echo "Don't forget to update the following important variables:"
echo " - OPENAI_API_KEY: Required for AI query functionality"
echo " - MAPBOX_ACCESS_TOKEN: Required for map visualization"
echo " - SECRET_KEY: Should be a secure random string for production"

echo "Environment setup complete!" 