import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import user from '../img/user.png';
import { RViewer, RViewerTrigger } from 'react-viewerjs';
import {Card} from 'react-bootstrap'
import '../css/verFotos.css'
import { Imagen } from './Imagen';

const urlAlbumes = "http://18.191.164.43:9000/albumes2";
const urlFotosPerfil = "http://18.191.164.43:9000/fotosPerfilUsuario";
const urlPublicadas = "http://18.191.164.43:9000/fotosPublicadasUsuario";
const urlUsuario = "http://18.191.164.43:9000/usuarioId";
const urlFoto = "http://18.191.164.43:9000/obtenerFoto";

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
            this.Ordenar();
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
        //    console.log(response);
        //    console.log(fotoBase64.length);
        //    console.log(fotoBase64);
            var aux = [];
            aux = this.state.foto.split('.');
            var ext = aux[1]
        //    console.log('la extension es: ' + ext);
            fotoBase64 = 'data:image/' + ext + ';base64,' + fotoBase64;
        //    console.log(fotoBase64);
            this.setState({
                miFoto: fotoBase64
            });
            return fotoBase64;
        })
        .catch(error=>{
            console.error('error al convertir foto')
        })
    }

    RecuperarFotosPerfil(){
        //obtener ubicacion de todas las fotos de perfil
        for(let i=0; i < this.state.fotosPerfil.length; i++){
            var fp = this.state.fotosPerfil[i].ubicacion;
            var fotourl = fp.replace(":", "%3A");
            fotourl = 'https://practica1-g25-imagenes.s3.us-east-2.amazonaws.com/' + fotourl;
            this.state.perfilMostrar.push(fotourl)
        }
    }

    Ordenar(){
        //recorrer albumes
        for(let i =0; i < this.state.albumes.length; i++){
            var alb = this.state.albumes[i].titulo;
            //recorrer fotos publicadas
            var temp = [];
            for(let j=0; j < this.state.fotosPublicadas.length; j++){
                var pertenece = this.state.fotosPublicadas[j].album;
                if(alb == pertenece){
                    var fp = this.state.fotosPublicadas[j].ubicacion;
                    var fotourl = fp.replace(' ', '+');
                    fotourl = 'https://practica1-g25-imagenes.s3.us-east-2.amazonaws.com/' + fotourl;
                    temp.push(fotourl);
                }
            }
            this.state.general.push(temp);
        }
        console.log('Fotos Publicadas');
        console.log(this.state.general);
    }


    render(){
        
        var datos2 = this.state.perfilMostrar.map((p,i)=>{
            return <figure className="figure tam">
            <img src={p} className="rou" alt="..."/>
            <figcaption className="figure-caption text-end">Foto de perfil #{i+1}</figcaption>
          </figure>
        });

        var datosP = this.state.general.map((g, i)=>{
            return<div className="espacio"> <Card>
                <Card.Body>
                <Card.Title>{this.state.albumes[i].titulo}</Card.Title>
                <div className="text-center divo">
                {g.map((u,j)=>{
                    return(
                        <Imagen ubicacion={u}/>
                    )
                })}
                </div>
                </Card.Body>
                </Card>
                </div>
        });

        return(
         
        <div>
            <div>
                <div className="container album">
                    <Card>
                        <Card.Body>
                            <Card.Title>FOTOS DE PERFIL</Card.Title>
                            <div className="text-center divo">
                            {datos2}
                            </div>
                        </Card.Body>
                    </Card> 
                    {datosP}
                </div>
            </div>

            <div style={{display: 'flex', marginTop: '40px'}}>
            {this.state.general.map((g, i)=>{
                    return(   
                        g.map((u,j)=>{
                            return(
                                <RViewerTrigger index={i + j}>
                                    <div className="user-img-def">

                                    <a title="Detalle" onChange={this.handleChange(u)} href="./Foto">

                                            <img src={u} style={{width: '150px', height: '150px', marginLeft: '20px', border: '2px solid black'}}/>
                                            
                                            </a>
                                            
                                            </div>
                                </RViewerTrigger>
                            )
                        })
                    )
            })}
            </div>
        </div>    
        )
    }


    handleChange(ubicacion){
        cookies.set('ubicacion', ubicacion, {path: "/"});
    }
}