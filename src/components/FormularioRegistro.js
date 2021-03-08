import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import md5 from 'md5';
import user from '../img/user.png';
import swal from 'sweetalert';

const url = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/register";
const url2 = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/todos2";
const url3 = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/subirFoto";
const url4 = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/guardarFotoPerfil";
const cookies = new Cookies();
let enBase64 = '';
let imagen = user;
let ext = '';
let FechaHora = '';

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
            foto: "",
            usuarios: []
        }
    //}

    Comprobacion(){
        if(this.state.userName != '' && this.state.name != ''  && this.state.lastName != '' && this.state.contra != '' && this.state.contra2 != '' && this.state.foto != ''){
            if(this.state.contra == this.state.contra2){
                //guardar foto
                //this.state.foto = 'url'
                this.Registrar();
            }else{
                swal({
                    title: "Error",
                    text: "La contraseña no coincide",
                    icon: "error",
                    button: "Aceptar"
                });
            }
        }else{
            swal({
                title: "Error",
                text: "Llenar todos los campos",
                icon: "error",
                button: "Aceptar"
            });
        }
    }

    Registrar=async()=>{
        this.Usuarios();
        let nuevo = this.state.userName;
        let existe = 0;
        for(let i=0; i < this.state.usuarios.length; i++){
            let ver = this.state.usuarios[i].userName;
            if(ver == nuevo){
                existe = 1;
                break;
            }
        }
        console.log("va a registrar");
        if(existe == 0){
            console.log("no existe");
            var fechahora = new Date();
            var fecha = fechahora.getDate() + '-' + (fechahora.getMonth() + 1) + '-' + fechahora.getFullYear();
            var hora = fechahora.getHours() + ':' + fechahora.getMinutes() + ':' + fechahora.getSeconds();
            FechaHora = fecha + '_' + hora;
            console.log(FechaHora);
            axios.post(url, {userName: this.state.userName, nombre: this.state.name, apellido: this.state.lastName, contra: md5(this.state.contra), foto: 'Fotos_Perfil/' + this.state.userName + '_' + FechaHora + '.' + ext})
            .then(response=>{
                console.log('response');
                console.log(response.data);
                if(response.data == "error"){
                    console.log("error al registrarse");
                    swal({
                        title: "Error",
                        text: "Error al registrarse",
                        icon: "error",
                        button: "Aceptar"
                    });
                }else if(response.data == "success"){
                    //guardar foto de perfil
                    this.GuardarFoto();
                    console.log("El usuario fue registrado");
                    swal({
                        title: "Registrado",
                        text: "Registrado correctamente",
                        icon: "success",
                        button: "Aceptar"
                    })
                    .then((value) => {
                        window.location.href="./"
                        //swal(`The returned value is: ${value}`);
                      });
                    //alert("El usuario fue registrado");
                    //cookies
                    /*var usuario = response.data.Item;
                    cookies.set('userName', usuario.userName, {path: "/"});
                    cookies.set('nombre', usuario.name, {path: "/"});
                    cookies.set('apellido', usuario.lastName, {path: "/"});
                    cookies.set('contra', usuario.contra, {path: "/"});
                    alert(`Bienvenido ${usuario.name}.`);*/
                    //window.location.href="./"//"./profile"
                }
            })
            .catch(error=>{
                console.log("ERROR")
            })
        }else{
            swal({
                title: "Error",
                text: "El nombre de usuario esta ocupado",
                icon: "error",
                button: "Aceptar"
            });
            console.log('el usuario ya existe');
        }
    }

    Usuarios=async()=>{
        axios.get(url2)
        .then(response=>{
            console.log(response.data);
            const users = (response.data).Items;
            console.log(users);
            this.setState({
                usuarios: users
            });
            console.log(this.state.usuarios);
        })
        .catch(error=>{
            console.log('error')
        })
    }

    GuardarFoto=async()=>{
        console.log('guardar foto');
        axios.post(url3, {nombreImagen: FechaHora, imagenBase64: this.state.foto, extension: ext, userName: this.state.userName})
        .then(response=>{
            console.log('response.data');
            console.log(response.data);
            if (response.data == "correcto"){
                console.log('foto guardada');
                this.GuardarFotoenBD();
            }else{
                console.log('error al guardar la foto');
            }
        })
        .catch(error=>{
            console.log("error")
        })
    }

    GuardarFotoenBD=async()=>{
        console.log('guardar foto en tabla');
        axios.post(url4, {idFoto: this.state.userName + '_' + FechaHora + '.' + ext, idUser: this.state.userName, ubicacion: 'Fotos_Perfil/' + this.state.userName + '_' + FechaHora + '.' + ext})
        .then(response=>{
            if(response.data == "success"){
                console.log('foto guardada en la tabla');
            }else{
                console.log('error al guardar foto en tabla');
            }
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
                    var aux2, aux3 = [];
                    aux2 =aux[0].split('/');
                    aux3 = aux2[1].split(';');
                    ext = aux3[0]
                    console.log('la extension es: ' + ext);
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
        //console.log(this.state.foto);
        //console.log(this.state.userName);
        this.Comprobacion();
        console.log('registro')
        //alert("registrando");
        //<img src={`data:image/png;base64,${enBase64}`} />
        
        //<div className="user-img-def">
        //<img src={`${imagen}`} />
    //</div>
    }

    
    
}