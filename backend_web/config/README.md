### info:
- **context.json**
    - configuraciones dbs a publicar
- **encdecrypt.json**
    - como se cifrarán las contraseñas y tokens según el dominio de origen. `header.host o header.origin`
    - así pues el token desde un dominio no sirve para otro
- **login.json**
    - `usuario/contraseña` que debe enviar cada dominio de origen para poder acceder a los recursos
    - si todo va bien se devolverá el token de acceso que caduca a la semana. 
    
### Notas:
- Para poder usar el endpoint `/apifiy/security/get-password`, habría que configurar **encdecrypt** (domain: self) con el mismo cifrado del dominio sobre el que se desea generar un login.