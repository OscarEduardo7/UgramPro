from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)

#instanciamos dynamo
dynamodb = boto3.resource('dynamodb', aws_access_key_id = "AKIA3EBUF4FC4J6L3CH7", 
                          aws_secret_access_key = "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",
                          region_name = "us-east-2")

from boto3.dynamodb.conditions import Key, Attr

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



# se puede setear el puerto que queremos utilizar
# app.run( port = 8000)
# si queremos que este en modo escucha para cualquier cambio
# app.run( debug = True, port = 8000)
if __name__ == '__main__':
    app.run(debug=True)