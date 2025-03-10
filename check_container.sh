#!/bin/bash
echo "Checking Docker containers..."
docker ps

echo "Checking if port 5000 is open..."
docker exec docker-backend-1 netstat -tuln | grep 5000

echo "Checking logs of backend container..."
docker logs docker-backend-1 | tail -n 20 