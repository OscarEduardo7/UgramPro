from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
import base64
import logging

app = Flask(__name__)
CORS(app)

#instanciamos dynamo
dynamodb = boto3.resource('dynamodb', aws_access_key_id = "AKIA3EBUF4FC4J6L3CH7", 
                          aws_secret_access_key = "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",
                          region_name = "us-east-2")

from boto3.dynamodb.conditions import Key, Attr

#s3
s3 = boto3.client('s3', aws_access_key_id = 'AKIA3EBUF4FC4WB2TUVZ',
                    aws_secret_access_key = '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',
                    region_name = "us-east-2")

from botocore.exceptions import ClientError

#-----------------------------------------------------------------------------------------------

## prueba para INSERTAR en una TABLA
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json(force=False)
        print(str(data))
        usuario = data.get('userName')
        contra = data.get('contra')
        print("******* "+str(usuario)+" ____ "+str(contra))
        
        table = dynamodb.Table('prueba')
        
        r = table.put_item(
            Item={
                "id": usuario,
                "contra": contra
            }
        )
        msg = "Se inserto correctamente"       
    return jsonify({"mensaje": r['Item'] })


##obtener usuario por ID
@app.route('/login2', methods=['POST'])
def login2():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        
        table = dynamodb.Table('Usuarios')
        
        response = table.get_item(
            Key={
                "userName": usuario
            }
        )
        
        print(response)
            
        item = response
             
    return item

##editar Usuarios
@app.route('/editarUsuarios', methods=['POST'])
def editarUsuarios():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        foto = data.get('foto')
        
        table = dynamodb.Table('Usuarios')
        
        response = table.update_item(
            Key={
                "userName": usuario
            },
            UpdateExpression="set nombre= :nom, apellido= :las, foto= :miF",
            ExpressionAttributeValues={
            ":nom": nombre,
            ":las": apellido,
            ":miF": foto
            },
            ReturnValues= "UPDATED_NEW"
        )            
    return response


##editar Usuarios
@app.route('/getAlbumes', methods=['POST'])
def getAlbumes():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        
        table = dynamodb.Table('Albumes')
        
        response = table.scan(
            FilterExpression = 'idUser = :n',
            ExpressionAttributeValues = {':n' : usuario}
        )
        items = response['Items']
        
    return response

## insertar nuevo album
@app.route('/newAlbum', methods=['POST'])
def newAlbum():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        titulo = data.get('titulo')
        
        table = dynamodb.Table('Albumes')
        
        r = table.put_item(
            Item={
                "id": usuario+"_"+titulo,
                "idUser": usuario,
                "titulo": titulo
            }
        )
        msg = "Se creo el album"       
    return "Creado"

## Eliminar album
@app.route('/deleteAlbum', methods=['POST'])
def deleteAlbum():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        titulo = data.get('titulo')
        
        table = dynamodb.Table('Albumes')
        
        try:
            
            response = table.delete_item(
                Key={
                    "id": usuario+"_"+titulo
                }
            )
        except ClientError as e:
            if e.response['Error']['Code'] == "ConditionalCheckFailedException":
                print(e.response['Error']['Message'])
            else:
                raise
        else:
            return "{}"

#-- Registrar nuevo usuario ------------
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        contra = data.get('contra')
        foto = data.get('foto')
        
        table = dynamodb.Table('Usuarios')
        
        r = table.put_item(
            Item={
                "userName": usuario,
                "nombre": nombre,
                "apellido": apellido,
                "contra": contra,
                "foto": foto
            }
        )       
    return "suceess"

# -- Todos2 ---- obtiene todos los usuarios
@app.route('/todos2', methods=['GET'])
def todos2():
    if request.method == 'GET':
       
        table = dynamodb.Table('Usuarios')
        
        response = table.scan(
            Limit= 100
        )        
    return response


#-- guardarFotoPerfil ------------
@app.route('/guardarFotoPerfil', methods=['POST'])
def guardarFotoP():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        idFoto = data.get('idFoto')
        idUser = data.get('idUser')
        ubicacion = data.get('ubicacion')
        
        table = dynamodb.Table('FotosPerfil')
        
        r = table.put_item(
            Item={
                "idFoto": idFoto,
                "idUser": idUser,
                "ubicacion": ubicacion,
            }
        )       
    return "suceess"

#-- guardarFotoPerfil ------------
@app.route('/guardarFotos', methods=['POST'])
def guardarFotos():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        idFoto = data.get('idFoto')
        usuario = data.get('userName')
        album = data.get('album')
        nombre = data.get('nombreI')
        ubicacion = data.get('ubicacion')
        
        table = dynamodb.Table('FotosPublicadas')
        
        r = table.put_item(
            Item={
                "idFoto": idFoto,
                "album": album,
                "nombreFoto": nombre,
                "ubicacion": ubicacion,
                "usuario": usuario
            }
        )       
    return "suceess"

##---- Mostrar Fotos ------
@app.route('/fotosPerfilUsuario', methods=['POST'])
def fotosPerfilUsuario():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        
        table = dynamodb.Table('FotosPerfil')
        
        response = table.scan(
            FilterExpression = 'idUser = :n',
            ExpressionAttributeValues = {':n' : usuario}
        )
        items = response['Items']
        
    return response

##---- Fotos subidas por el usuario ------
@app.route('/fotosPublicadasUsuario', methods=['POST'])
def fotosPublicadasUsuario():
    if request.method == 'POST':
        data = request.get_json(force=False)
        
        usuario = data.get('userName')
        
        table = dynamodb.Table('FotosPublicadas')
        
        response = table.scan(
            FilterExpression = 'usuario = :n',
            ExpressionAttributeValues = {':n' : usuario}
        )
        items = response['Items']
        
    return response


@app.route('/albumes2', methods=['POST'])
def albumes2():
    if request.method == 'POST':
        data = request.get_json(force=False)
        user = data.get('userName')
        table = dynamodb.Table('Albumes')

        response = table.scan(
            FilterExpression = 'idUser = :n',
            ExpressionAttributeValues = {':n': user}
        )

        items = response['Items']

    return response

@app.route('/usuarioId', methods=['POST'])
def usuarioId():
    if request.method == 'POST':
        data = request.get_json(force=False)
        user = data.get('userName')
        table = dynamodb.Table('Usuarios')

        response = table.scan(
            FilterExpression = 'userName = :n',
            ExpressionAttributeValues = {':n': user}
        )

        items = response['Items']
    
    return response

#--------------S3------------------
@app.route('/subirFoto', methods=['POST'])
def subirFoto():
    if request.method == 'POST':
        data = request.get_json(force=False)
        nombreFoto = data.get('nombreImagen')
        foto = data.get('imagenBase64')
        extension = data.get('extension')
        usuario = data.get('userName')

        nombre = 'Fotos_Perfil/' + usuario + '_' + nombreFoto + '.' + extension
        print(nombre)

        #convertir base 64 a bytes
        buffer = base64.b64decode(foto)

        response = s3.put_object(
            ACL='public-read',
            Body=buffer,
            Bucket='practica1-g25-imagenes',
            Key=nombre,
            ContentType= 'image'
        )
        return 'correcto'
    
@app.route('/subirFoto2', methods=['POST'])
def subirFoto2():
    if request.method == 'POST':
        data = request.get_json(force=False)
        nombreFoto = data.get('nombreImagen')
        foto = data.get('imagenBase64')
        extension = data.get('extension')
        usuario = data.get('userName')
        album = data.get('album')

        nombre = 'Fotos_Publicadas/' + usuario + '_' + album + '_' + nombreFoto + '.' + extension
        print(nombre)

        #convertir base 64 a bytes
        buffer = base64.b64decode(foto)

        response = s3.put_object(
            ACL='public-read',
            Body=buffer,
            Bucket='practica1-g25-imagenes',
            Key=nombre,
            ContentType= 'image'
        )
        return 'correcto'


@app.route('/obtenerFoto', methods=['POST'])
def obtenerFoto():
    if request.method == 'POST':
        data = request.get_json(force=False)
        nombre = data.get('id')

        response = s3.get_object(
            Bucket = 'practica1-g25-imagenes',
            Key = nombre
        )
        #print(response['Body'].read())
        dataBase64 = base64.b64encode(response['Body'].read())

        #obj = s3.Object('practica1-g25-imagenes', nombre)
        #body = obj.get()['Body'].read()
        #print(body)
        return dataBase64 # 'response'
    
    
# se puede setear el puerto que queremos utilizar
# app.run( port = 8000)
# si queremos que este en modo escucha para cualquier cambio
# app.run( debug = True, port = 8000)
if __name__ == '__main__':
    app.run(debug=True)