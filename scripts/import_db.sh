#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: import_db.sh <container> <dumpfile>"
    exit
fi

container="$1"
dumpfile="$2"
database="mydatabase"
. .env
echo ${PW_DB}
cat $dumpfile | docker exec -i $container mariadb -p${PW_DB}  $database