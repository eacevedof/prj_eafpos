- ejecutar la creacion de certificado

openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout eafpos-ca.key -out eafpos-ca.pem -subj "/C=US/CN=eafpos-ca"
openssl x509 -outform pem -in eafpos-ca.pem -out eafpos-ca.crt