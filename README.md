> En la rama  'master' se encuentra el codigo utilizado.

# Practica1_Grupo25

## [Ugram - Practica 1](http://practica1-g25-paginaweb.s3-website.us-east-2.amazonaws.com/)

- - -

## Datos de los estudiantes:
* 201602469 - Oscar Eduardo Mazariegos López.
* 201612413 - Jennifer Marisol López Orozco.
 
- - -

## Descripción de arquitectura:
Para el desarrollo de **Ugram** se implementó una arquitectura server con AWS.

<img src="imagenesDocu\Arquitectura.PNG" border="2" align="center"/>
  
### **Amazon EC2**
Es el servicio web, con el cual se crearon las instancias de maquinas virtuales, las cuales contienen los servidores **Node Js** y **Flask Python**.

Ademas de proveer el servicio **Elastic Load Balancing**, con el cual se creo el balanceador de carga para los dos servidores.


### **DynamoDB**
La base de datos, contiene toda la información necesaria para poder realizar las diferentes funciones de la pagina web.

Las tablas utilizadas:
* Usuarios
* Albumes
* FotosPublicadas
* FotosPerfil

### **S3**
Buckets de almacenamiento de tipo objetos, en cual se encarga de almacenar las fotos que se carguen a la pagina web.

Este mismo servicio se utilizo para almacenar la pagina web, la cual posteriormente se despliega en el DNS que provee el servicio.

- - -
## Usuarios IAM utilizados
Los siguientes usuarios de **IAM** fueron utilizados para obtener los servicios de AWS.

1. Usuario **DynamoDB**
   * Politicas de permisos Asociadas:
     *  AmazonDynamoDBFullAccess.

2. Usuario **S3**
   * Politicas de permisos Asociadas:
     *  AmazonS3FullAccess.

3. Usuario **EC2**
   * Politicas de permisos Asociadas:
     *  AmazonEC2FullAccess.

---
## Capturas de pantalla:

### Capturas **S3**

* Bucket Pagina Web:
  <img src="imagenesDocu\bucketPagina.PNG" border="2" align="center"/>

* Bucket Fotos:
  <img src="imagenesDocu\bucketFotos.PNG" border="2" align="center"/>

* Politica aplicada a buckets:
  <img src="imagenesDocu\politicas Bucket.PNG" border="2" align="center"/>

### Capturas **EC2**

* Instancias utilizadas:
  <img src="imagenesDocu\Instancias.PNG" border="2" align="center"/>

* Segurity Groups asociados:
  <img src="imagenesDocu\segurity.png" border="2" align="center"/>

* Balanceador de carga:
  <img src="imagenesDocu\balancer.PNG" border="2" align="center"/>

### Capturas **DynamoDB**

* Tablas utilizadas:
  <img src="imagenesDocu\tablasDynamo.PNG" border="2" align="center"/>

* Tabla usuarios:
  <img src="imagenesDocu\tablaUsername.PNG" border="2" align="center"/>


### Capturas **Aplicacion Web**
<img src="imagenesDocu\login.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\registro.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\perfil.png" border="2" align="center"/>

- - -

<img src="imagenesDocu\subirfoto.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\perfilEdit.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\albumes.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\fotos.PNG" border="2" align="center"/>

- - -
- - -






