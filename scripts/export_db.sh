#!/bin/bash


#outputfile="mydatabase_dump.sql"
if [ $# -lt 1 ]; then
    echo "Usage: export_db.sh <outptfile>"
    echo "Eg: scripts/export_db.sh bookings_03.sql"
    exit
fi

outputfile="$1"

. .env
#docker exec $DATABASE_CONTAINER mariadb-dump --complete-insert -u root -p${PW_DB} --databases mydatabase >> dumps/$outputfile
docker exec $DATABASE_CONTAINER mariadb-dump --add-drop-database --no-data --skip-comments --skip-triggers --routines --events --single-transaction --compact -u root -p${PW_DB} --databases mydatabase >> dumps/$outputfile
# Rm eg:
# CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mydatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
# Since we want CREATE DATABASE IF NOT EXISTS.
# There muss be a parameter for mariadb-dump to do this...
sed -i -E '/CREATE DATABASE \/\*\![0-9]+*/d' dumps/$outputfile
echo "CREATE DATABASE IF NOT EXISTS mydatabase;" > dumps/tmp
cat dumps/$outputfile >> dumps/tmp
mv dumps/tmp  dumps/$outputfile
#{echo -n 'CREATE DATABASE IF NOT EXISTS `mydatabase`;';cat dumps/$outputfile} > dumps/$outputfile