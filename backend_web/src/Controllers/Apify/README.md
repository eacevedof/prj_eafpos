# Apify

## Endpoints
```js
/apify/contexts
/apify/contexts/{id}
/apify/dbs/{id_context}
/apify/tables/{id_context}/{dbname}
// /apify/tables/{id_context} -- todas las tablas de un contexto?? de momento no
/apify/fields/{id_context}/{dbname}/{tablename}/{fieldname}
/apify/fields/{id_context}/{dbname}/{tablename}

//custom query
/apify/read/raw
/apify/read
/apify/write/raw
/apify/write
```

## Ejemplos
- /apify/contexts
  - [http://localhost:3000/apify/contexts](http://localhost:3000/apify/contexts)
- /apify/contexts/{id}
  - [http://localhost:3000/apify/contexts/devlocal](http://localhost:3000/apify/contexts/devlocal)
- /apify/dbs/{id_context}    
  - [http://localhost:3000/apify/dbs/devlocal](http://localhost:3000/apify/dbs/devlocal)
- /apify/tables/{id_context}/{dbname}
  - [http://localhost:3000/apify/tables/devlocal/db_killme](http://localhost:3000/apify/tables/devlocal/db_killme)
- /apify/tables/{id_context}
  - falta: todas las tablas de un contexto
- /apify/fields/{id_context}/{dbname}/{tablename}
  - [http://localhost:3000/apify/fields/devlocal/db_killme/tbl_operation](http://localhost:3000/apify/fields/devlocal/db_killme/tbl_operation)
- /apify/fields/{id_context}/{dbname}/{tablename}/{fieldname}    
  - [http://localhost:3000/apify/fields/devlocal/db_killme/tbl_operation/op_d1](http://localhost:3000/apify/fields/devlocal/db_killme/tbl_operation/op_d1)

### Consulta `SELECT .. FROM`
- **POST** /apify/read?context=c1&dbname=db_one
  ```
  queryparts[table]:table_1
  queryparts[fields][]:description
  queryparts[fields][]:codeerp
  queryparts[where][]:codeerp LIKE '%b%'
  queryparts[groupby][]:codeerp
  queryparts[orderby][]:description
  ```
  - ![](https://trello-attachments.s3.amazonaws.com/5ea73745e908e04a038ca5ef/528x725/67967e1f92a12415f1b11413d7f9e4f6/image.png) 
- **POST** /apify/read/raw?context=c1&dbname=db_one
  ```
  query:SELECT * FROM table_1 ORDER BY 1 DESC
  ```
  - ![](https://trello-attachments.s3.amazonaws.com/5ea73745e908e04a038ca5ef/958x656/6e269ca99b6aa4287d182b76486d7747/image.png)

### Consulta `INSERT INTO`
- **POST** /apify/write?context=c1&dbname=db_one
  ```
  action:insert
  queryparts[table]:table_1
  queryparts[fields][description]:from-ddd
  queryparts[fields][codeerp]:88  
  ```
  ![](https://trello-attachments.s3.amazonaws.com/5ea73745e908e04a038ca5ef/1029x562/70129150852ecc5402bd4de7655fc353/image.png)

### Consulta `UPDATE ... WHERE ...`
- **POST** http://localhost:3000/apify/write?context=c1&dbname=db_one
  ```
  action:update
  queryparts[table]:table_1
  queryparts[fields][description]:from-xxx
  queryparts[fields][codeerp]:aaaa
  queryparts[where][]:id=5
  ```
  ![](https://trello-attachments.s3.amazonaws.com/5ea7372a1613296bcf5eda15/5ea73745e908e04a038ca5ef/2cfabbc049d0e1fa91a047f22390fd38/image.png)

### Consulta `DELETE .. FROM ... WHERE ...`
- **POST** http://localhost:3000/apify/write?context=c1&dbname=db_one
  ```
  action:delete
  queryparts[table]:table_1
  queryparts[where][]:id=5
  ```
  ![](https://trello-attachments.s3.amazonaws.com/5ea7372a1613296bcf5eda15/5ea73745e908e04a038ca5ef/9a75ac00a9286da70013b9d6f60b1990/image.png)

## Contextos
```json

```