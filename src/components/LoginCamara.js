import {React, createRef, Component} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import Webcam from "react-webcam";
import cama from '../img/lente.png';

const WebcamComponent = () => <Webcam />;

const Surl ="http://18.191.164.43:9000/login2";
const urlUsuario = "http://18.191.164.43:9000/usuarioId";
const urlFoto = "http://18.191.164.43:9000/obtenerFoto";
const compFoto = "http://18.191.164.43:9000/compareFace";

const cookiess = new Cookies();

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

var imageSrc = "";
var imagenFo = "";

export default class LoginCamara extends Component {

    //creamos constructor 
        myRef = createRef();
        state = {
            userName: '',
            fotoUsuario: '',
            fotoCamara: '',
            foto: ''
        }

    componentDidMount(){
        if(cookiess.get('userName')){
            window.location.href='./profile';
        }
    }

    IniciarSesion=async()=>{
        axios.post(Surl,{userName: this.state.userName})
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
                //RETORNA EL USUARIO
                console.log(response.data.Item);
                var usuario = response.data.Item;
                cookiess.set('userName', usuario.userName, {path: "/"});
                cookiess.set('nombre', usuario.nombre, {path: "/"});
                cookiess.set('apellido', usuario.apellido, {path: "/"});
                cookiess.set('contra', usuario.contra, {path: "/"});
                swal({
                    title: "Bienvenid@",
                    text: "Reconocimiento Correcto.",
                    icon: "success",
                    button: "Aceptar"
                });
                setTimeout("location.href='./profile'", 2000);
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
            //setTimeout("location.href='./'", 2000);
        })
    }

    //Obtenemos la foto del usuario
    Usuario=async()=>{
        axios.post(urlUsuario,{userName: this.state.userName})
        .then(response=>{
            const ftp = (response.data).Items;
            //console.log(ftp);
            this.setState({
                foto: ftp[0].foto
            });
            console.log("Foto ->" + this.state.foto);
            this.ObtenerFoto();
        })
        .catch(error=>{
            console.error("error")
        })
    }

    ObtenerFoto=async()=>{
        axios.post(urlFoto,{id: this.state.foto})
        .then(response=>{
            let fotoBase64 = response.data;
            //console.log(fotoBase64);
            this.setState({
                fotoUsuario: fotoBase64
            });
            imagenFo = fotoBase64
            var aux = [];
            aux = this.state.foto.split('.');
            var ext = aux[1]
            axios.post(compFoto,{imagen1: fotoBase64, imagen2: imageSrc})
            .then(response=>{
                var similarVal = response.data.Comparacion[0].Similarity;
                console.log(response.data.Comparacion[0].Similarity)

                if(similarVal > 90){
                    this.IniciarSesion();
                }
            })
            .catch(error=>{
                swal({
                    title: ":(",
                    text: "Usuario no reconocido.",
                    icon: "error",
                    button: "Aceptar"
                });
            })
        })
        .catch(error=>{
            console.error('error al convertir foto')
        })
    }

    //hago el submit y obtengo los datos metiendolos en el state
    _handleSubmit = (e) =>{
        e.preventDefault()
        //obtener foto de la camara en base 64
        this._ObtenerFoto();
        this.Usuario();
        //this.IniciarSesion()  
    }

    _ObtenerFoto =async() => {
        let fotoAux = this.myRef.current.getScreenshot();
        var aux=[];
        aux = fotoAux.split(',');
        imageSrc = aux[1];
        this.setState({
            fotoCamara: imageSrc
        });   
    }

    render(){

        return(
            
            <div className="modal-dialog text-center">
            <div className="col-sm-12 cuadro-central">
                <div className="modal-content">
                <div className="col-12 user-img2">
                        <img src={cama}></img>
                    </div>
                    <form onSubmit={this._handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="uUsuario" className="form-label">Ingresa tu nombre de usuario:</label>
                            <input onChange={e => this.setState({userName: e.target.value})} type="text" className="form-control" id="uUsuario" placeholder="Usuario" />
                        </div>
                            <div className="container camara">
                            <Webcam
                                audio={false}
                                height={200}
                                ref={this.myRef}
                                screenshotFormat="image/jpeg"
                                width={390}
                                videoConstraints={videoConstraints}
                            />
                            </div>
                        <br></br>
                        <button type="submit" className="btn btn-dark">Iniciar Sesión</button>
                        </form>
                    <div>
                        <br></br>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
