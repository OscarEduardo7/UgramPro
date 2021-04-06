import React, { Component } from 'react';
import user1 from '../img/user.png';
import axios from 'axios';
import request from 'superagent';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';

const Surl ="http://18.191.164.43:9000/login2";
const cookiess = new Cookies();

export default class FormLogin extends Component {
    //creamos constructor 
    constructor(){
        //hereda los componentes de react
        super();
        this.state = {
            userName: '',
            contra: ''
        }
    }


    componentDidMount(){
        if(cookiess.get('userName')){
            window.location.href='./profile';
        }
        //SUPERAGENT
        /*request
        //http://localhost:9000/usuarios
        //https://reqres.in/api/users?page=2
            .get('http://localhost:9000/todos')
            .end((err, res) => {
                console.log(JSON.parse(res.text))
                //.data al final
                const personasU = (JSON.parse(res.text)).Items;
                console.log(personasU);
                this.setState({
                    personas: personasU
                });
            });*/
    }

    IniciarSesion=async()=>{
        console.log("entra iniciar sesion");
        //aplicamos MD5 a la contraseña al enviarla.
        // { this.state }
        axios.post(Surl,{userName: this.state.userName, contra: md5(this.state.contra)})
        .then(response=>{
            if(response.data == "vacio"){
                console.log("vacio")
                swal({
                    title: "Error",
                    text: "El usuario no existe.",
                    icon: "info",
                    button: "Aceptar",
                });
            }else{
                //SI retorna un usuario entonces verificamos la contraseña.
                //mostramos el usuario que devuelve
                let cEntra = response.data.Item.contra;
                let contraL = md5(this.state.contra);
                if(cEntra != contraL){
                    swal({
                        title: "Error",
                        text: "Usuario/Contraseña incorrectos.",
                        icon: "error",
                        button: "Aceptar"
                    });
                }else{
                    console.log("Credenciales correctas.");
                    console.log(response.data.Item);
                    //variable de sesion con universal cookies.
                    var usuario = response.data.Item;
                    cookiess.set('userName', usuario.userName, {path: "/"});
                    cookiess.set('nombre', usuario.nombre, {path: "/"});
                    cookiess.set('apellido', usuario.apellido, {path: "/"});
                    cookiess.set('contra', usuario.contra, {path: "/"});
                    swal({
                        title: "Bienvenid@",
                        text: ":) Credenciales correctas.",
                        icon: "success",
                        button: "Aceptar"
                    });
                    setTimeout("location.href='./profile'", 2000);
                    //alert(`Bienvenido ${usuario.nombre} de nuevo.`);
                    //window.location.href="./profile"

                }
            }
        })
        .catch(error=>{
            console.error(error)
            swal({
                title: "Ocurrio algo",
                text: "No existe el usuario.",
                icon: "error",
                button: "Aceptar"
            });
            setTimeout("location.href='./'", 2000);
        })
    }


    //hago el submit y obtengo los datos metiendolos en el state
    _handleSubmit = (e) =>{
        e.preventDefault()
        this.IniciarSesion();
    }

    render(){

        return(
            
            <div className="modal-dialog text-center">
            <div className="col-sm-8 cuadro-central">
                <div className="modal-content">
                    <div className="col-12 user-img">
                        <img src={user1}></img>
                    </div>
                    <form onSubmit={this._handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="uUsuario" className="form-label">Usuario</label>
                            <input onChange={e => this.setState({userName: e.target.value})} type="text" className="form-control" id="uUsuario" placeholder="Usuario" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="uContra" className="form-label">Contraseña</label>
                            <input onChange={e => this.setState({contra: e.target.value})} type="password" className="form-control" id="uContra" placeholder="Contraseña"/>
                        </div>
                        <button type="submit" className="btn btn-dark">Iniciar Sesión</button>
                        </form>
                        <p>o</p>
                        <button className="btn btn-dark" onClick={()=>{window.location.href='./camLogin';}}>Entrá por Cámara</button>
                        <p> </p>
                        <a href="/register">Registrate ahora</a>
                    <div>
                        <br></br>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
