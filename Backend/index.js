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


//este no se toca.
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


//este no se toca..
app.put("/editarUsuario", function(req, res){
  let body = req.body;
  let usuario = body.userName;
  let nombre = body.nombre;
  let apellido = body.apellido;

  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Usuarios',
    Key: {
      'userName': usuario
    },
    UpdateExpression: "set nombre= :nom, apellido= :las",
    ExpressionAttributeValues:{
      ":nom": nombre,
      ":las": apellido
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

//este no se toca...
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