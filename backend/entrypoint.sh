#!/bin/sh
set -e

# Check if Docker socket is available and Docker daemon is running
if docker ps > /dev/null 2>&1; then
  echo "Docker is available. Running tests that depend on Docker..."

  # Run Maven tests
  mvn test

else
  echo "Docker daemon is not available. Make sure /var/run/docker.sock is mounted."
fi

# Finally, start the Java application
exec "$@"