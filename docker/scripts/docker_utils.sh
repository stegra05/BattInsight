#!/bin/bash

# Get the directory of the script and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
DOCKER_DIR="$PROJECT_ROOT/docker"
COMPOSE_FILE="$DOCKER_DIR/docker-compose.yml"

# Function to restart Docker containers
restart_containers() {
    echo "Stopping Docker containers..."
    docker compose -f "$COMPOSE_FILE" down
    
    echo "Building backend container..."
    docker compose -f "$COMPOSE_FILE" build backend
    
    echo "Building frontend container..."
    docker compose -f "$COMPOSE_FILE" build frontend
    
    echo "Starting Docker containers..."
    docker compose -f "$COMPOSE_FILE" up -d
    
    echo "Docker containers restarted successfully."
    echo "Backend available at: http://localhost:5000"
    echo "Frontend available at: http://localhost:80"
}

# Function to check container status
check_container_status() {
    echo "Checking Docker containers..."
    docker ps
    
    echo "Checking if backend port 5000 is open..."
    docker exec docker-backend-1 netstat -tuln | grep 5000 || echo "Port 5000 not found or container not running"
    
    echo "Checking if frontend port 80 is open..."
    docker exec docker-frontend-1 netstat -tuln | grep 80 || echo "Port 80 not found or container not running"
}

# Function to view container logs
view_container_logs() {
    container_name=${1:-docker-backend-1}
    lines=${2:-20}
    
    echo "Checking logs of $container_name container..."
    if [[ $lines == "all" ]]; then
        docker logs $container_name
    else
        docker logs $container_name | tail -n $lines
    fi
}

# Function to rebuild and restart a specific container
rebuild() {
    service=${1:-backend}
    
    echo "Rebuilding $service container..."
    docker compose -f "$COMPOSE_FILE" build $service
    docker compose -f "$COMPOSE_FILE" up -d $service
    
    echo "$service container rebuilt and restarted."
}

# Main function to parse arguments
main() {
    case "$1" in
        restart)
            restart_containers
            ;;
        status)
            check_container_status
            ;;
        logs)
            view_container_logs $2 $3
            ;;
        rebuild)
            rebuild $2
            ;;
        *)
            echo "Usage: $0 {restart|status|logs [container_name] [lines|all]|rebuild [service_name]}"
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@" 