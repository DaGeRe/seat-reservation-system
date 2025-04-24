#!/bin/bash

# Funktion, die beim Empfang von SIGINT (Ctrl+C) ausgeführt wird
cleanup() {
    echo "Ctrl+C gedrückt. Führe 'docker compose down' aus..."
    docker compose stop
    exit 0
}

# Trap für SIGINT (Ctrl+C) einrichten
trap cleanup SIGINT

# Setze Umgebungsvariablen und führe den Docker-Build und -Start aus
DOCKER_BUILDKIT=1 docker compose --env-file .env build \
    --build-arg CACHEBUST=$(date +%s) \
    --build-arg http_proxy=http://proxy.justiz.sachsen.de:3128 \
    --build-arg https_proxy=http://proxy.justiz.sachsen.de:3128

# Starte die Docker-Container
docker compose up

# Wenn das Skript normal beendet wird, führe auch 'docker compose down' aus
echo "Skript beendet. Führe 'docker compose down' aus..."
docker compose stop