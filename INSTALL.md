- ejecutar la creacion de certificado
- en el contenedor web:
  openssl req -x509 -nodes -days 365 -subj "/CN=eafpos.loc" -addext "subjectAltName=DNS:eafpos.loc" -newkey rsa:2048 -keyout /etc/ssl/private/localhost-ca.key -out /etc/ssl/certs/localhost-ca.crt;
  https://192.168.1.128
  - nginx t
  - nginx -s reload