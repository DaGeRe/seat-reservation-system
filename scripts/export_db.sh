#!/bin/bash

container="desksharingtool_dev-database-1"
if [ $# -eq 1 ]; then
    container="$1"
fi

outputfile="dumps/mydatabase_dump.sql"

echo "SET FOREIGN_KEY_CHECKS=0;" > $outputfile
docker exec $container mariadb-dump --add-drop-table --complete-insert -u root -pmypasss --databases mydatabase >> $outputfile
echo "FOREIGN_KEY_CHECKS=1;" >> $outputfile