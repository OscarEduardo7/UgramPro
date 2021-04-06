> En la rama  'master' se encuentra el codigo utilizado.

# Practica1_Grupo25

## [Ugram Pro - Practica 2](http://g25-p2.s3-website-us-east-1.amazonaws.com/)

- - -

## Datos de los estudiantes:
* 201602469 - Oscar Eduardo Mazariegos López.
* 201612413 - Jennifer Marisol López Orozco.
 
- - -

## Descripción de arquitectura:
Para el desarrollo de **Ugram Pro** se implementó una arquitectura server con AWS.

<img src="imagenesDocu\arquitectura2.PNG" border="2" align="center"/>
  
### **Amazon EC2**
Es el servicio web, con el cual se creo la instancia de una maquina virtual, la cual contiene el servidor de **Node Js**.


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

### **Amazon Lex**
Es un servicio para construir interefaces de conversación en cualquier aplicación que use voz y texto.

Con esta herramienta se creo un chat bot el cual asiste al cliente que utilice la pagina web.

### *Funciones implementadas en el chatbot:*

1. **Bienvenid@:** Al agregar un saludo al chat, este le dara la bienvenida a la plataforma.

2. **Una cita con los desarrolladores:** Se implemento el poder concretar una cita con los desarrolladores por si les interesa algun trabajo relacionado a el software que ellos ven.
    
3. **Preguntas:** Se implemento el poder realizar ciertas preguntas relacionas a la pagina, estas pueden ser de como subir una foto o bien como activar la camara para el reconocimiento de inicio de sesion.

4. **Dejar una recomendación:** Se implemento el poder hacer recomendaciones acerca de la pagina, o bien si se encuentra algun error en esta.

### **Amazon Rekognition**
Una herramienta creada para detectar diferentes propiedades en imagenes.

Con esta herramienta reconocemos si el usuario es el mismo que esta intentando iniciar sesión, su estado de animo y otras caracteriticas como edad etc.

### *Funciones:*

1. **Comparar rostro:** Con esta funcion detectamos si el usuario el cual quiere ingresar a la plataforma es la misma persona quien creo la cuenta. Tiene que existir un parecido de 90%.

2. **Detectar etiquetas:** Con esta funcion detectamos las diferentes caracteristicas que tenga la foto de perfil del usuario. Indicando  la edad, si utiliza lentes, hasta su genero.
  De igual manera las fotos que se suben a la plataforma son examinadas y estas se suben a un album especifico el cual es el resultado de la consulta con rekognition.

3. **Extraer texto:** Con esta funcion se puede obtener el texto de alguna imagen.

### **Amazon Translate**
Herramienta utilizada para traducir el texto que contenta alguna imagen de las cuales se suben a nuestros albumes.

- - -
## Usuarios IAM utilizados
Los siguientes usuarios de **IAM** fueron utilizados para obtener los servicios de AWS.

1. Usuario **DynamoDB**
   * Politicas de permisos Asociadas:
     *  AmazonDynamoDBFullAccess.

2. Usuario **S3**
   * Politicas de permisos Asociadas:
     *  AmazonS3FullAccess.

3. Usuario **Lex**
   * Politicas de permisos Asociadas:
     *  AmazonLexFullAccess.

4. Usuario **Rekognition**
   * Politicas de permisos Asociadas:
     *  AmazonRekognitionFullAccess.

5. Usuario **Translate**
   * Politicas de permisos Asociadas:
     *  AmazonTranslateFullAccess.

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

### Capturas **DynamoDB**

* Tablas utilizadas:
  <img src="imagenesDocu\tablasDynamo.PNG" border="2" align="center"/>

* Tabla usuarios:
  <img src="imagenesDocu\tablaUsername.PNG" border="2" align="center"/>


### Capturas **Aplicacion Web**
<img src="imagenesDocu\login.PNG" border="2" align="center"/>

- - -
<img src="imagenesDocu\camara.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\registro.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\perfil1.png" border="2" align="center"/>

- - -
<img src="imagenesDocu\extraer.PNG" border="2" align="center"/>

- - -
<img src="imagenesDocu\chat.PNG" border="2" align="center"/>
- - -
<img src="imagenesDocu\chat3.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\subirfoto2.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\perfilEdit.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\fotos.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\detalle.PNG" border="2" align="center"/>

- - -

<img src="imagenesDocu\foto.PNG" border="2" align="center"/>

- - -
- - -






