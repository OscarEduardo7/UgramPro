import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import md5 from 'md5';
import user from '../img/user.png';

const url = '';
const cookies = new Cookies();
let enBase64 = '';
let imagen = user;

export default class FormularioRegistro extends Component{

   // constructor(){
     //   super();
        //this.
        state = {
            userName: '',
            name: '',
            lastName: '',
            contra: '',
            contra2: '',
            foto: ""
        }
    //}

    Comprobacion(){
        if(this.state.userName != '' && this.state.name != ''  && this.state.lastName != '' && this.state.contra != '' && this.state.contra2 != '' && this.state.foto != ''){
            if(this.state.contra == this.state.contra2){
                //guardar foto
                this.Registrar();
            }else{
                alert("La contraseña no coincide");
            }
        }else{
            alert("Llenar todos los campos");
        }
    }

    Registrar=async()=>{
        axios.post(url, {userName: this.state.userName, nombre: this.state.name, apellido: this.state.lastName, contra: md5(this.state.contra), foto: this.state.foto})
        .then(response=>{
            if(response.data == "error"){
                console.log("error al registrarse");
                alert("No fue posible el registro");
            }else{
                console.log("El usuario fue registrado");
                alert("El usuario fue registrado");
                //cookies
                var usuario = response.data.Item;
                cookies.set('userName', usuario.userName, {path: "/"});
                cookies.set('nombre', usuario.name, {path: "/"});
                cookies.set('apellido', usuario.lastName, {path: "/"});
                cookies.set('contra', usuario.contra, {path: "/"});
                alert(`Bienvenido ${usuario.name}.`);
                window.location.href="./profile"
            }
        })
        .catch(error=>{
            console.log("ERROR")
        })
    }

    render(){
        const convertirBase64=(archivos)=>{
            Array.from(archivos).forEach(archivo=>{
                var reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload=function(){
                    var aux=[];
                    var base64 = reader.result;
                    imagen = base64;
                    console.log("a base 64");
                    console.log(imagen);
                    aux = base64.split(',');
                    //console.log(aux[1]);
                   // this.state.foto = base64;
                    //console.log("state.foto");
                    //console.log(this.state.foto);
                    //this.state.foto = base64
                    //this.setState({foto: aux[1]})
                    enBase64 = aux[1];
                    console.log(enBase64);
                }
            })
        }
        return(
            
            <div className="modal-dialog text-center">
            <div className="col-sm-8 cuadro-central">
                <div className="modal-content">
                    <div className="col-12 user-img">
                        <img src={imagen}></img>
                    </div>
                    <form onSubmit={this._handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="uFoto" className="form-label">Seleccionar foto</label>
                            <div id="div_file">
                                <label id="texto">Add Photo</label>
                                <input type="file" id="Photo" accept="image/png, image/jpeg" multiple onChange={(e)=>convertirBase64(e.target.files)}></input>   
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="uUsuario" className="form-label">Usuario</label>
                            <input onChange={e => this.setState({userName: e.target.value})} type="text" className="form-control" id="uUsuario" placeholder="Usuario" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="uNombre" className="form-label">Nombre</label>
                            <input onChange={e => this.setState({name: e.target.value})} type="text" className="form-control" id="uNombre" placeholder="Nombre" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="uApellido" className="form-label">Apellido</label>
                            <input onChange={e => this.setState({lastName: e.target.value})} type="text" className="form-control" id="uApellido" placeholder="Apellido" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="uContra" className="form-label">Contraseña</label>
                            <input onChange={e => this.setState({contra: e.target.value})} type="password" className="form-control" id="uContra" placeholder="Contraseña"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="uContraC" className="form-label">Confirmar contraseña</label>
                            <input onChange={e => this.setState({contra2: e.target.value})} type="password" className="form-control" id="uContrac" placeholder="Confirmar contraseña"/>
                        </div>
                        <button type="submit" className="btn btn-dark">Registrarse</button>
                        </form>
                        <a href="/">Ya tienes una cuenta? logeate</a>
                    <div>
                        <br></br>
                    </div>
                    </div>
            </div>
        </div>
        );

    }


    _handleSubmit = (e) =>{
        e.preventDefault();
        console.log('oprimio registarse');
        this.state.foto = enBase64;
        console.log(this.state.foto);
        console.log(this.state.userName);
        //<img src={`data:image/png;base64,${enBase64}`} />
        
        //<div className="user-img-def">
        //<img src={`${imagen}`} />
    //</div>
    }

    
    
}