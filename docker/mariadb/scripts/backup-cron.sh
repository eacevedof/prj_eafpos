#!/usr/bin/bash

# /usr/bin/bash /appdata/scripts/backup-cron.sh
tagnow=$(date '+%Y%m%d-%H%M%S')

mysqldump --host=localhost --user=$MYSQL_USER --password=$MYSQL_ROOT_PASSWORD db_shopelchalan > /appdata/dumps/db_backup_db_shopelchalan_$tagnow.sql