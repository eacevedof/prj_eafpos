#!/usr/bin/bash

# /usr/bin/bash /appdata/scripts/restore.sh
tagnow=$(date '+%Y%m%d-%H%M%S')
echo $tagnow

mysql --host=localhost --user=$MYSQL_USER --password=$MYSQL_ROOT_PASSWORD db_shopelchalan < /appdata/dumps/restore.sql