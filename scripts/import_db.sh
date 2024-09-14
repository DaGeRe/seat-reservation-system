#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: import_db.sh <container> <dumpfile>"
    exit
fi

container="$1"
dumpfile="$2"

#docker exec $container mariadb-dump -u root -pmypasss mydatabase > dumps/mydatabase_dump.sql
#cat $dumpfile | docker exec $container mariadb-dump -u root -pmypasss mydatabase
docker exec $container  mariadb-dump  -u root -pmypasss mydatabase < $dumpfile --force

#cat /root/DeskSharingTool_Dev/dumps/mydatabase_dump.sql