var att = require('dynamodb-data-types').AttributeValue;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
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

//peticion docClient
app.get("/todos", function(req, res){
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'Usuarios',
    Limit: 10
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