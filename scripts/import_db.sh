#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: import_db.sh <container> <dumpfile>"
    echo "Eg: scripts/export_db.sh desksharingtool_dev-database-1 dumps/bookings_03.sql"
    exit
fi

container="$1"
dumpfile="$2"
database="mydatabase"
. .env
cat $dumpfile | docker exec -i $container mariadb -p${PW_DB}  $database