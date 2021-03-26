```
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_shopelchalan` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

mysql --host=localhost --user=root --password=1234 db_name

/usr/bin/bash ./backup-cron.sh
5 * * * * /usr/bin/bash /appdata/scripts/backup-cron.sh >> /appdata/scripts/backup-cron.log

el entrypoint por defecto está en:
/usr/local/bin
```
