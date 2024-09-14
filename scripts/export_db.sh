#!/bin/bash

container="desksharingtool_dev-database-1"
if [ $# -eq 1 ]; then
    container="$1"
fi

outputfile="dumps/mydatabase_dump.sql"

docker exec $container mariadb-dump --add-drop-table --complete-insert -u root -pmypasss --databases mydatabase >> $outputfile