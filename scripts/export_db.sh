#!/bin/bash

outputfile="mydatabase_dump.sql"
if [ $# -lt 1 ]; then
    echo "Usage: export_db.sh <container>"
    echo "Eg: scripts/export_db.sh desksharingtool_dev-database-1 bookings_03.sql"
    exit
fi

container="$1"
if [ $# -ne 1 ]; then
    outputfile="$2"
fi


docker exec $container mariadb-dump --complete-insert -u root -pmypasss --databases mydatabase >> dumps/$outputfile