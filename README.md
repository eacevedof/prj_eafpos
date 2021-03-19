### EAF POS System

#### imagenes
- **inicio**
- ![inicio](https://trello-attachments.s3.amazonaws.com/6053c0cae4790579a20d72fc/1088x858/a62477c6a37fdd4efdff6ab613fe60a1/image.png)
- **teclado login**
- ![teclado-login](https://trello-attachments.s3.amazonaws.com/6053c0cae4790579a20d72fc/614x553/e06c35494e8a03030d787234122f0b15/image.png)

#### [mesas](https://drive.google.com/file/d/1xgZBeAZgveG2zUsyjcXPaD9F2I_HRKfU/view?usp=sharing)
- pide pin
  - permite selecciona entre mesa bar
    - como se ve la pantalla de bar?
  - ![mesa bar](https://trello-attachments.s3.amazonaws.com/6053c0cae4790579a20d72fc/1053x821/18d29cfbeb0e20ba5b5806e410601d68/image.png)
  - al presionar en mesa  
    - se ven mesas en verde, morado y un texto, que texto? que significan los colores?
    - como se trata la reserva de una mesa?
    - botones laterales filtrar mesas, refrescar pantalla, cancelar  
    - ![mesas](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/0d59a40efa2f26ba18536ad6020277fa/image.png) 
  - al seleccionar una mesa aparece un teclado numerico para ingresar num personas
    - ![teclado](https://trello-attachments.s3.amazonaws.com/6053c0cae4790579a20d72fc/688x615/baa7e57272a97658af83403937462cac/image.png)
  - despues del numero de personas aparece la pantalla de seleccion de bebidas/platos
    - que significan los colores? como se configuran?
    - plato
    - ![mondonguito](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/de5994c97ce1cd874af706709594a509/image.png)
    - bebida  
    - ![seleccion](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/7b58d5ff75b9d9313317ba3ed738d3d2/image.png)
  - se puede aplicar notas para cocina
    - es solo para cocina? o tambien aparece en el ticket del cliente 
    - ![modificaciones](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/a1f3a13f5e194583151738ad8d8b1bd9/image.png)  

#### llevar
- pide pin
- muestra la seleccion de grupos y platos/bebidas
  - en la parte izquierd permite configuracion de grupos temporales para que se borren a determinada hora
  - ![](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/b4e6283e0a021dd168a7f0a55b44b58b/image.png)
- botones de grupos e items, para llevar, nombre del cliente, alertador personas
  - mientras se va configurando en el lado derecho se va viendo la comanda con los cambios
    - ![](https://trello-attachments.s3.amazonaws.com/6053c0cae4790579a20d72fc/660x546/978c6523f039c1f5093da262d00b3b0e/image.png)
  - para llevar:
    - permite cambio de tipo o confirmar
    - ![](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/6594e8161b888cb7c8a35f70bc468de6/image.png)
  - nombre del cliente:
    - ![](https://trello-attachments.s3.amazonaws.com/5b014dcaf4507eacfc1b4540/6053c0cae4790579a20d72fc/5334e6fe6b34e1d4ce8945e38f8de12a/image.png)
  - alertador (pagar):
    - como que no se usa no?
    - presenta teclado numerico
  - personas:
    - imputar el numero de personas que sean
    - presenta teclado numerico
- si se desea cancelar el pedido se le da a un boton abajo que no llego a ver
- no entiendo, si es para llevar porque se selecciona mesa? es una mesa que ha pedido para llevar?
- que sucede si una mesa pide solo algunos platos para llevar? se le crea un nuevo pedido?

#### revisar
- muestra un resumen de los pedidos hechos por usuario x
  - que es la busqueda rápida? se usa?
  - que es por número de cuenta? se usa?

- hay un botón "mis ordenes" que muestra todos los pedidos de todos los usuarios que están abiertas
  - que es abierta? que no ha salido de cocina? que no se ha pagado?
- en este listado se puede hacer click sobre un item y entrar al detalle
  - en el detalle aparecen botones:
    - editar orden
    - imprimir
    - pagar al banco de los empleados ???
    - abajo del ticket hay dos flechas y un boton "... pagar"


#### pagar
- se ingresa pin
- aparece un listado de las ordenes abiertas
- se pulsa sobre el item
  - aparece pantalla con botones 
    - efectivo
    - tarjeta de debito
    - *hay más botones pero no se utilizan*

#### salida de cajero
- se utiliza al finalizar el día
- no pide pin?
- que pasa cuando se cierra?
- que sucede si se ha presionado sin querer?

#### operaciones
- pide pin
- se visualiza la venta del día
  - se muestra un espacio izquierdo con un texto y en el derecho una columna con unos 7 botones
- hay varios botones (col derecha) pero solo se usa el que dice "ordenes realizadas"
  - al presionar aparece un panel con un grid de botones (+/- 16)
  - se usan dos botones "reporte de ventas por categoria" y "reporte de ventas por ordenes del menu"
    - presenta un filtro por fecha desde/hasta
      - al presionar sobre la fecha se presentan botones selectores
      - mes(arriba y abajo), dia, año, cancelar, seleccionar
    - presenta filtro producto (like multiple campos)
    - el primero muestra subtotales por grupos (bebidas, cervezas, comidas ,extras, postres, licores)
    - el segundo muestra venta por palto/bebida (producto) 
      - hay una columna % a que se refiere?

#### oficina
- pide pin
- varias opciones, principalmente cambio de menu
- menu > configurar > platillos/bebidas (con ratón y teclado)
  - aparece dos columnas nombre del menu y la otra con botones configurables con platos del menu
  - ver como se crea un menu?

#### salir del programa
- que ocurre cuando le das? te pide confirmación? imprime algo?

### registrar pago con tarjeta
- se puede hacer de dos maneras: boton pagar o revisar
- mis ordenes (para que muestre todos los pedidos)
- busco nº de ticket o mesa (que esta en el ticket impreso)
- se presiona sobre el item en cuestion
- aparece la pantalla con botones efectivo, tarjeta 
- se presiona en tarjeta 
  - aparece teclado de numeros con opciones fijas de billetes y monedas
  - y como primera opcion un boton con el monto exacto
- si se presiona en ok o en el botón aparece una pantalla resumen y se imprime
  - que imprime? un ejemplo de ticket impreso
  - total pagado
  - cambio a dar
  - botones imprimir, listo

- como se obtiene el recibo de cliente antes de darselo para que pague?
