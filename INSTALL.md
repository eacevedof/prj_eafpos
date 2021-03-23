- ejecutar la creacion de certificado
- en el contenedor web:
  - openssl req -x509 -nodes -days 365 -subj "/CN=192.168.1.132" -addext "subjectAltName=IP.1:192.168.1.132" -newkey rsa:2048 -keyout /etc/ssl/private/localip-ca.key -out /etc/ssl/certs/localip-ca.crt 
  ```  
  cp /appdata/io/in/localip-ca.crt /etc/ssl/certs
  cp /appdata/io/in/localip-ca.key /etc/ssl/private
  ```
  - https://192.168.1.132:1000/   back
  - https://192.168.1.132:1001/   spa
  - nginx -t
  - nginx -s reload
  - [ejemplo ssl domain config](https://codingwithmanny.medium.com/configure-self-signed-ssl-for-nginx-docker-from-a-scratch-7c2bcd5478c6)
  - [ejemplo ssl ip](https://help.kendis.io/en/articles/3382550-configure-ssl-for-docker)
  