- ejecutar la creacion de certificado
- en el contenedor web:
  openssl req -x509 -nodes -days 365 -subj "/CN=eafpos.loc" -addext "subjectAltName=DNS:eafpos.loc" -newkey rsa:2048 -keyout /etc/ssl/private/localhost-ca.key -out /etc/ssl/certs/localhost-ca.crt;
  https://192.168.1.128
  - nginx t
  - nginx -s reload
  - [ejemplo ssl domain config](https://codingwithmanny.medium.com/configure-self-signed-ssl-for-nginx-docker-from-a-scratch-7c2bcd5478c6)
  - [ejemplo ssl ip](https://help.kendis.io/en/articles/3382550-configure-ssl-for-docker)