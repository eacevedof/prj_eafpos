#!/bin/sh

# /bin/sh /appdata/scripts/backup-cron.sh
tagnow=$(date '+%Y%m%d-%H%M%S')

mysqldump --host=php-eafpos-db --user=$MYSQL_USER --password=$MYSQL_ROOT_PASSWORD db_shopelchalan > /appdata/dumps/db_backup_db_shopelchalan_$tagnow.sql