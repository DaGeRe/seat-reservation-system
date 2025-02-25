#!/bin/bash
. ./.env
container=${DATABASE_CONTAINER}
echo "Connect to ${container}"
docker exec -it ${container} db.sh
