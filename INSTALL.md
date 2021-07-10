- ejecutar la creacion de certificado
- quizas seria conveniente crear una variable de entorno IP_CERTIFCATE
- en el contenedor web:
  - openssl req -x509 -nodes -days 730 -subj "/CN=192.168.1.132" -addext "subjectAltName=IP.1:192.168.1.132" -newkey rsa:2048 -keyout /etc/ssl/private/localip-ca.key -out /etc/ssl/certs/localip-ca.crt 
  ```  
  cp /etc/ssl/certs/localip-ca.crt /appdata/io/out; cp /etc/ssl/private/localip-ca.key /appdata/io/out
  
  cp /appdata/io/in/localip-ca.crt /etc/ssl/certs; cp /appdata/io/in/localip-ca.key /etc/ssl/private; nginx -s reload
  
  curl https://192.168.1.132:1000 --insecure
  curl https://192.168.1.132:1001 --insecure
  ```
  - https://192.168.1.132:1000/   back
  - https://192.168.1.132:1001/   spa
  - nginx -t
  - nginx -s reload
  - [ejemplo ssl domain config](https://codingwithmanny.medium.com/configure-self-signed-ssl-for-nginx-docker-from-a-scratch-7c2bcd5478c6)
  - [ejemplo ssl ip](https://help.kendis.io/en/articles/3382550-configure-ssl-for-docker)
  - netstat -ap tcp | grep 90 check ports
- ejecutar el log consumer
  - entrar en el contenedor de php
  - dentro de la carpeta **console** ejecutar:
    - `php run.php --class=App.Services.Kafka.LogConsumerService`
  
### helpers
```sql
SELECT  FROM_UNIXTIME(timest/1000,'%Y-%m-%d %H:%i:%s') timest, TRIM(message) m , TRIM(title) t FROM app_log ORDER BY id DESC
```