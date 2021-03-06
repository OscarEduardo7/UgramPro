import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import user from '../img/user.png';
import { RViewerTrigger, RViewer} from 'react-viewerjs';
import bootstrap from 'react-bootstrap';

const urlAlbumes = "http://localhost:9000/albumes2";
const urlFotosPerfil = "http://localhost:9000/fotosPerfilUsuario";
const urlPublicadas = "http://localhost:9000/fotosPublicadasUsuario";
const urlUsuario = "http://localhost:9000/usuarioId";
const urlFoto = "http://localhost:9000/obtenerFoto";

const cookies = new Cookies();

let fotoBase64 = '';// user;

export default class VerFotos extends Component{

    state = {
        fotosPerfil: [],
        albumes: [],
        fotosPublicadas: [],
        general: [],
        userName: '',
        foto: '',
        x: '',
        perfilMostrar: []
    }


    componentDidMount(){
        if(!cookies.get('userName')){
            window.location.href='./';
        }
        this.state.userName = cookies.get("userName");
        //console.log('usuario' + this.state.userName);
        this.RecuperarAlbumes();
        this.FotosDePerfil();
        this.Usuario();
    }

    RecuperarAlbumes=async()=>{
        axios.post(urlAlbumes,{userName: this.state.userName})
        .then(response=>{
            const alb = (response.data).Items;
            this.setState({
                albumes: alb
            });
            console.log("albumes");
            console.log(this.state.albumes);
            this.Publicadas();
        })
        .catch(error=>{
            console.error("error")
        })
    }

    FotosDePerfil=async()=>{
        axios.post(urlFotosPerfil,{userName: this.state.userName})
        .then(response=>{
            const ftp = (response.data).Items;
            this.setState({
                fotosPerfil: ftp
            });
            console.log("Fotos de perfil");
            console.log(this.state.fotosPerfil);
            this.RecuperarFotosPerfil();
        })
        .catch(error=>{
            console.error("error")
        })
    }

    Publicadas=async()=>{
        axios.post(urlPublicadas,{userName: this.state.userName})
        .then(response=>{
            const ftp = (response.data).Items;
            this.setState({
                fotosPublicadas: ftp
            });
            console.log("Fotos publicadas por " + this.state.userName);
            console.log(this.state.fotosPublicadas);
        })
        .catch(error=>{
            console.error("error")
        })
    }

    Usuario=async()=>{
        axios.post(urlUsuario,{userName: this.state.userName})
        .then(response=>{
            const ftp = (response.data).Items;
            console.log(ftp);
            this.setState({
                foto: ftp[0].foto
            });
            console.log("Foto " + this.state.foto);
            this.ObtenerFoto(this.state.foto);
        })
        .catch(error=>{
            console.error("error")
        })
    }

    ObtenerFoto=async(param)=>{
        axios.post(urlFoto,{id: param})
        .then(response=>{
            console.log('mostrar foto');
            fotoBase64 = response.data;
            console.log(response);
            console.log(fotoBase64.length);
            console.log(fotoBase64);
            var aux = [];
            aux = this.state.foto.split('.');
            var ext = aux[1]
            console.log('la extension es: ' + ext);
            fotoBase64 = 'data:image/' + ext + ';base64,' + fotoBase64;
            console.log(fotoBase64);
            return fotoBase64;
        })
        .catch(error=>{
            console.error('error')
        })
    }

    RecuperarFotosPerfil=async()=>{
        //obtener ubicacion de todas las fotos de perfil
        for(let i=0; i < this.state.fotosPerfil.length; i++){
            var fp = this.state.fotosPerfil[i].ubicacion;
            var fotourl = fp.replace(":", "%3A");
            fotourl = 'https://practica1-g25-imagenes.s3.us-east-2.amazonaws.com/' + fotourl;
            this.state.perfilMostrar.push(fotourl)
        }
        console.log(this.state.perfilMostrar);

    }

    render(){
        
        var datos2 = this.state.perfilMostrar.map((p,i)=>{
            return <option>{p}</option>
        });

        return(
         
            <div  className="mb-3">
                <h1>hola</h1>
                <div className="user-img-def">
                    <img src={`${fotoBase64}`} />
                </div>
                        <div className="mb-3">
                            <label htmlFor="uUsuario" className="form-label">Usuario</label>
                            <input onChange={e => this.setState({x: e.target.value})} type="text" className="form-control" id="uUsuario" placeholder="Usuario" />
                        </div>
                        <div className="mb-3">
                            <RViewer imageUrls={this.state.perfilMostrar}>
                            <div style={{display: 'flex', marginTop: '40px'}}>
                            {this.state.perfilMostrar.map((p, i)=>{
                                return(
                                    <RViewerTrigger index={i}>
                                        <div className="user-img-def">
                                                <img src={p} style={{width: '150px', height: '150px', marginLeft: '20px', border: '2px solid black'}}/>
                                                </div>
                                    </RViewerTrigger>
                                )
                            })}</div>

                            </RViewer>
                        </div>
            </div>
            
        )
    }
}

/**        
             */