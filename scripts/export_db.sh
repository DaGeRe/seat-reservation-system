#!/bin/bash

container="desksharingtool_dev-database-1"
if [ $# -eq 1 ]; then
    container="$1"
fi

docker exec $container mariadb-dump -u root -pmypasss mydatabase > dumps/mydatabase_dump.sql
