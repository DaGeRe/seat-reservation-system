#!/bin/bash

outputfile="mydatabase_dump.sql"
if [ $# -lt 1 ]; then
    echo "Usage: export_db.sh <container>"
    exit
fi

container="$1"
if [ $# -ne 1 ]; then
    outputfile="$2"
fi


docker exec $container mariadb-dump --add-drop-table --complete-insert -u root -pmypasss --databases mydatabase >> dumps/$outputfile