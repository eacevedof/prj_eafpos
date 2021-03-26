### To do:
- be:
  - cron upload backup nube o copy en gdrive
  - backup resources  

- db:
  - cron backup dump 

- categoria:
  - postres
  - comidas
  - bebidas
  - licores
  - creverzas
  - extras
  - sopas

- grupo (de producto):
  - hora fin
  - nombre
  - color
  
- producto:
  - nombre único
  - color
  - categoria (fk) 
  - relacion con impresoras
  - relacion con grupos
  - notas admin
  - blqueado

- pedido:
  - mesa, barra llevar
  - nº personas  
  - flag de producto impreso
  - flag producto servido
  - flag para llevar
  - notas cocina
  - notas producto  
  - nº mesa
  - nº terminal
    - desde donde se hace el pedido
  - hora pedido
  - hora servido
  - hora pagado
  - notas admin
  - producto cancelado (nota motivo)
  
- mesa:
  - nº
  - nombre  
  - hora inicio
  - hora fin
  - hora reserva
  - bloqueada
