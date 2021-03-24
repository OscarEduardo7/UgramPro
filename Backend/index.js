var att = require('dynamodb-data-types').AttributeValue;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var uuid = require('uuid');
const cors = require('cors');
//para credenciales de AWS
const aws_keys = require('./creeds');

//para identificadores unicos
var uuid = require('uuid');
var corsOptions = { origin: true, optionsSuccessStatus: 200};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

var port = 9000;
app.listen(port);
console.log('Servidor listo en el puerto ',port);

//AWS
//instanciamos el SDK de aws
var AWS = require('aws-sdk');
AWS.config.update(aws_keys.dynamodb);
//instanciamos los servicios que vamos a utilizar
const Dynamo = new AWS.DynamoDB(aws_keys.dynamodb);
const s3 = new AWS.S3(aws_keys.s3);
const rek = new AWS.Rekognition(aws_keys.rekognition);

//peticion ejemplo
app.get("/", function(req, res){
    res.json({ mensaje: "HOLA MUNDO"});
});

//peticion docClient
app.get("/nuevos", function(req, res){
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'persona',
    Key: {
      "id": "1"
    }
  };

  docClient.get(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});

app.get("/login", function(req, res){
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    Key: {
      'userName': 'oscar2',
    },
    TableName: 'Usuarios',
    AttributesToGet: ['nombre','contra']
  };

  docClient.get(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});


//este no se toca. - obtener usuario para login
app.post("/login2", function(req, res){
  let body = req.body;
  let usuario = body.userName;
  let contra = body.contra;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    Key: {
      'userName': usuario,
    },
    TableName: 'Usuarios',
  };

  docClient.get(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
        if(data.Item == null){
          res.send("vacio")
          console.log("vacio")
        }else{
          res.send(data);
          console.log(data);
        }

      }
  });
});


//este no se toca.. / actualizar usuario
app.put("/editarUsuario", function(req, res){
  let body = req.body;
  let usuario = body.userName;
  let nombre = body.nombre;
  let apellido = body.apellido;
  let foto = body.foto

  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Usuarios',
    Key: {
      'userName': usuario
    },
    UpdateExpression: "set nombre= :nom, apellido= :las, foto= :miF",
    ExpressionAttributeValues:{
      ":nom": nombre,
      ":las": apellido,
      ":miF": foto
    },
    ReturnValues: "UPDATED_NEW"
  };

  docClient.update(params, function (err, data) {
      if (err) {
          res.send("Nel");
      } else {
          res.send(data);
      }
  });
});

//este no se toca... / obtener Albumes de un usuario especifico
app.post("/getAlbumes", function(req, res){
  let body = req.body;
  let usuario = body.userName;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Albumes',
    FilterExpression : 'idUser = :n',
    ExpressionAttributeValues : {':n' : usuario}
  };

  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          //console.log(data);
      }
  });
});

//este no se toca---- CREAR ALBUM NUEVO -----
app.post("/newAlbum", function(req, res){
  let body = req.body;
  let usuario = body.userName;
  let titulo = body.titulo;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var input ={
    'id': usuario+"_"+titulo,
    'idUser': usuario,
    'titulo': titulo
  }

  var params = {
    TableName: 'Albumes',
    Item: input
  };

  docClient.put(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log("noCreado");
      } else {
          res.send("Creado");
      }
  });
});

//este no se toca---- ELIMINAR ALBUM -----
app.post("/deleteAlbum", function(req, res){
  let body = req.body;
  let usuario = body.userName;
  let titulo = body.titulo;

  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'Albumes',
    Key: {
      "id": usuario+"_"+titulo
    }
  };

  docClient.delete(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log("no se elimino");
      } else {
          res.send(data);
          console.log("eliminado");
      }
  });
});

app.post("/new", function(req, res){
    let body = req.body;
    
    let name = body.nombre;

    Dynamo.putItem({
        TableName: "persona",
        Item: {
        "id": { S: uuid() },
        "nombre": { S: name },
        }
    }, function (err, data) {
        if (err) {
        console.log('Error saving data:',err);
        res.send({ 'message': 'ddb failed' });
        } else {
        console.log('Save success: ',data);
        res.send({ 'message': 'ddb success' });
        }
    });
});

app.get("/usuarios", function(req, res){
    let params = {
        TableName: 'persona',
        Limit: 50
    };
    
    Dynamo.scan(params, function(err, data){
      if(err){
          console.log("Error", err);
      }  else{
          res.send(data.Items);
          
          /*var resumeAttrVal = {
            count: {"N": "4" },
            languages: { "SS": ["Java Script", "Ruby", "GLSL", "C" ] }
          };
          
          console.log(JSON.stringify(att.unwrap(resumeAttrVal)));*/
      }
    });
});

app.get("/usuario", function(req, res){
    var params = {
        TableName: 'persona',
        Key: {
          'id': {S: "1"}
        },
        ProjectionExpression: 'nombre'   //Este es solo para obtener un dato en especifico
      };
      
      Dynamo.getItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.Item);
          res.json(data.Item);
        }   
      });
    
});

//------Registrar usuario-------------
app.post("/register", function(req, res){
  let body = req.body;
  let usuario = body.userName;
  let nombre = body.nombre;
  let apellido = body.apellido;
  let contra = body.contra;
  let foto = body.foto;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var input = {
    'userName': usuario,
    'nombre': nombre,
    'apellido': apellido,
    'contra': contra,
    'foto': foto
  }

  var params = {
    TableName: 'Usuarios',
    Item: input
  };

  docClient.put(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err);
          console.log("user save error");
      } else {
        res.send("success");
        console.log("user save success");
        //console.log(res);
        console.log(res.data);
        console.log(usuario + " creado");
      }
  });
});

//Albums por usuario
app.get("/albumes", function(req, res){
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Albumes',
    Limit:10,
    Key: {
      "id": 2
    },
    //Item: {
      //"idUser": "oscar1"
    //}
  };

  console.log("pedir albumes");
  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});


//Albums por usuario
app.post("/albumes2", function(req, res){
  let body = req.body;
  let user = body.userName;
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Albumes',
    FilterExpression: 'idUser = :n',
    ExpressionAttributeValues: {':n':user}
  };

  console.log("pedir albumes");
  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});

app.get("/todos2", function(req, res){
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Usuarios',
    Limit: 100
  };

  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});


//--------S3------------------
app.post('/subirFoto', function(req, res){

  console.log("subir foto");
  var nombreFoto = req.body.nombreImagen;
  var foto = req.body.imagenBase64;
  var extension = req.body.extension;
  var usuario = req.body.userName;

  var nombre = 'Fotos_Perfil/' + usuario + '_' + nombreFoto + '.' + extension;

  console.log(nombre);

  //convertir base 64 a bytes
  let buffer = new Buffer.from(foto, 'base64');

  //-------------
  /*AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIA3EBUF4FC4WB2TUVZ',
    secretAccessKey: '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'
  })*/

  //var s3 = new AWS.S3();
  const params = {
    Bucket: "practica1-g25-imagenes",
    Key: nombre,
    Body: buffer,
    ContentType: 'image',
    ACL: 'public-read'
  };

  const putResult = s3.putObject(params).promise();
  res.json('correcto')
  //mensaje vacio es que si ingreso
  console.log('mensaje: ' + putResult);

})

app.post('/subirFoto2', function(req, res){

  console.log("subir fotos");
  var nombreFoto = req.body.nombreImagen;
  var foto = req.body.imagenBase64;
  var extension = req.body.extension;
  var usuario = req.body.userName;
  var album = req.body.album;

  var nombre = 'Fotos_Publicadas/' + usuario + '_' + album + '_' + nombreFoto + '.' + extension;

  console.log(nombre);

  //convertir base 64 a bytes
  let buffer = new Buffer.from(foto, 'base64');

  //-------------
  /*AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIA3EBUF4FC4WB2TUVZ',
    secretAccessKey: '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'
  })*/

  //var s3 = new AWS.S3();
  const params = {
    Bucket: "practica1-g25-imagenes",
    Key: nombre,
    Body: buffer,
    ContentType: 'image',
    ACL: 'public-read'
  };

  const putResult = s3.putObject(params).promise();
  res.json('correcto')
  //mensaje vacio es que si ingreso
  console.log('mensaje: ' + putResult);

})

//obtener foto en s3
app.post('/obtenerFoto', function (req, res) {
  //var carpeta = req.body.carpeta;
  var id = req.body.id;
  //direcccion donde esta el archivo a obtener
  var nombrei = id; //carpeta + "/" + id;
  var getParams = {
    Bucket: 'practica1-g25-imagenes',
    Key: nombrei
  }
  s3.getObject(getParams, function (err, data) {
    if (err)
      res.json("error")
    //de bytes a base64
    var dataBase64 = Buffer.from(data.Body).toString('base64');
    res.json(dataBase64)

  });

});

app.post("/guardarFotoPerfil", function(req, res){
  let body = req.body;
  let idFoto = body.idFoto;
  let idUser = body.idUser;
  let ubicacion = body.ubicacion;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var input = {
    'idFoto': idFoto,
    'idUser': idUser,
    'ubicacion': ubicacion
  }

  var params = {
    TableName: 'FotosPerfil',
    Item: input
  };

  docClient.put(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err);
          console.log("photo save error");
      } else {
        res.send("success");
        console.log("photo save success");
        //console.log(res);
        console.log(res.data);
        console.log(ubicacion + " guardada");
      }
  });
});

app.post("/guardarFotos", function(req, res){
  let body = req.body;
  let idFoto = body.idFoto;
  let usuario = body.userName;
  let album = body.album;
  let nombre = body.nombreI;
  let ubicacion = body.ubicacion;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var input = {
    'idFoto': idFoto,
    'album': album,
    'nombreFoto': nombre,
    'ubicacion': ubicacion,
    'usuario': usuario
  }

  var params = {
    TableName: 'FotosPublicadas',
    Item: input
  };

  docClient.put(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err);
          console.log("photo save error");
      } else {
        res.send("success");
        console.log("photo save success");
        //console.log(res);
        console.log(res.data);
        console.log(ubicacion + " guardada");
      }
  });
});

//-------Mostrar Fotos------------
//recuperar todas las fotos de perfil por usuario
app.post("/fotosPerfilUsuario", function(req, res){
  let body = req.body;
  let user = body.userName;
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'FotosPerfil',
    FilterExpression: 'idUser = :n',
    ExpressionAttributeValues: {':n':user}
  };

  console.log("pedir fotos de perfil");
  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});

//recuperar todas las fotos subidas por usuario
app.post("/fotosPublicadasUsuario", function(req, res){
  let body = req.body;
  let user = body.userName;
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'FotosPublicadas',
    FilterExpression: 'usuario = :n',
    ExpressionAttributeValues: {':n':user}
  };

  console.log("pedir fotos publicadas por " + user);
  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});

//recuperar usuario
app.post("/usuarioId", function(req, res){
  let body = req.body;
  let user = body.userName;
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Usuarios',
    FilterExpression: 'userName = :n',
    ExpressionAttributeValues: {':n':user}
  };

  console.log("informacion de " + user);
  docClient.scan(params, function (err, data) {
      if (err) {
          res.send(err);
          console.log(err)
      } else {
          res.send(data);
          console.log(data);
      }
  });
});

//===================================================== PRACTICA 2 =============================================
//==============================================================================================================

app.post('/compareFace', function (req, res) { 
  var body = req.body
  var imagen1 = body.imagen1;
  var imagen2 = body.imagen2;

  var params = {
    SourceImage: {
        Bytes: Buffer.from(imagen1, 'base64')     
    }, 
    TargetImage: {
        Bytes: Buffer.from(imagen2, 'base64')    
    },
    SimilarityThreshold: '85'
  };
  rek.compareFaces(params, function(err, data) {
    if (err) {
      res.json({mensajeErr: err})
      console.log("fin comparacion") 
    } 
    else {   
      res.json({Comparacion: data.FaceMatches}); 
      console.log("fin comparacion")     
    }
  });
});

// Analizar texto
app.post('/getTexto', function (req, res) { 
  var imagen = req.body.imagen;
  var params = {
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    }
  };
  rek.detectText(params, function(err, data) {
    if (err) {res.json({mensaje: "Error"})} 
    else {   
           res.json(data.TextDetections);      
    }
  });
});


// Obtener Etiquetas
app.post('/tagsProfile', function (req, res) { 
  var imagen = req.body.imagen;
  var params = {
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    },
    Attributes: ['ALL']
  };
  rek.detectFaces(params, function(err, data) {
    if (err) {res.json({mensaje: err})} 
    else {   
           res.json(data);      
    }
  });

});

