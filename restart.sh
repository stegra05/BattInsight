#!/bin/bash
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml build backend
docker compose -f docker/docker-compose.yml up -d 