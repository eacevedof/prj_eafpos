#!/usr/bin/bash

# /usr/bin/bash /appdata/scripts/restore.sh
tagnow=$(date '+%Y%m%d-%H%M%S')
echo $tagnow

mysql --host=localhost --user=$MYSQL_USER --password=$MYSQL_ROOT_PASSWORD db_eafpos < /appdata/io/in/restore.sql
echo db restored