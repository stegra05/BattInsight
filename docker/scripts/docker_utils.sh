#!/bin/bash

# Function to restart Docker containers
restart_containers() {
    echo "Stopping Docker containers..."
    docker compose -f ../docker-compose.yml down
    
    echo "Building backend container..."
    docker compose -f ../docker-compose.yml build backend
    
    echo "Starting Docker containers..."
    docker compose -f ../docker-compose.yml up -d
    
    echo "Docker containers restarted successfully."
}

# Function to check container status
check_container_status() {
    echo "Checking Docker containers..."
    docker ps
    
    echo "Checking if port 5000 is open..."
    docker exec docker-backend-1 netstat -tuln | grep 5000
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
        *)
            echo "Usage: $0 {restart|status|logs [container_name] [lines|all]}"
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@" 