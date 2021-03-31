import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';


import user from '../img/lente.png';
let imagen = user;

const translate = "http://localhost:9000/translate";
const urlFoto = "http://localhost:9000/foto";
const urlAlbumes = "http://localhost:9000/albumes2";
const urlPublicadas = "http://localhost:9000/fotosPublicadasUsuario";

const cookies = new Cookies();

export default class DetalleFoto extends Component{

    state = {
        userName: '',
        nombreImagen: '.',
        descripcion: '.',
        ubicacion: '',
        albumes: [],
        fotosPublicadas: [],
        fotos: [],
        album:{
            seleccionado: '',
        },
        traducirA:{
            seleccionado: '',
        }, 
        foto:{
            seleccionado: ''
        }
    }

    componentDidMount(){
        if(!cookies.get('ubicacion')){
            window.location.href='./fotos';
        }
        this.state.userName = cookies.get("userName");
        console.log('usuario: ' + this.state.userName);
        console.log("ubicacion: " + this.state.ubicacion);
        this.RecuperarAlbumes();  
    }

    Traducir=async()=>{
        if (this.state.traducirA.seleccionado != ''){
            let idioma = 'es';
            if (this.state.traducirA.seleccionado == 'Francés'){
                idioma = 'fr';
            } 
            else if (this.state.traducirA.seleccionado == 'Italiano'){
                idioma = 'it';
            }
            else if (this.state.traducirA.seleccionado == 'Coreano'){
                idioma = 'ko';
            }
            else if (this.state.traducirA.seleccionado == 'Ruso'){
                idioma = 'ru';
            }
            else if (this.state.traducirA.seleccionado == 'Inglés'){
                idioma = 'en';
            } 
            else if (this.state.traducirA.seleccionado == 'Español'){
                idioma = 'es';
            } 
            axios.post(translate, {"text": this.state.descripcion,  "opcion": idioma})
            .then(response=>{
                if(response.data != ""){
                    this.state.descripcion = response.data;   
                    console.log(this.state.descripcion);    
                }else{
                    console.log('error al traducir');
                }
            })
        }
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


    Publicadas=async()=>{
        axios.post(urlPublicadas,{userName: this.state.userName})
        .then(response=>{
            const ftp = (response.data).Items;
            this.setState({
                fotosPublicadas: ftp
            });
            console.log("Fotos publicadas por " + this.state.userName);
            console.log(this.state.fotosPublicadas);
            //this.Ordenar();
        })
        .catch(error=>{
            console.error("error")
        })
    }

    Ordenar(){
        //recorrer fotos publicadas
        this.state.fotos = [];
        for(let j=0; j < this.state.fotosPublicadas.length; j++){
            var pertenece = this.state.fotosPublicadas[j].album;
            if(this.state.album.seleccionado == pertenece){
                var fp = this.state.fotosPublicadas[j].nombreFoto;
                //var fotourl = fp.replace(' ', '+');
                //fotourl = 'https://practica1-g25-imagenes.s3.us-east-2.amazonaws.com/' + fotourl;
                this.state.fotos.push(fp);
            }
        }
        
        console.log('Fotos Publicadas');
        console.log(this.state.fotos);
    }

    RecFoto=async()=>{
        console.log("foto especifica " + this.state.album.seleccionado + this.state.foto.seleccionado);
        axios.post(urlFoto,{userName: this.state.userName, album: this.state.album.seleccionado, nombre: this.state.foto.seleccionado})
        .then(response=>{
            console.log(response.data);
            var fp = response.data[0].ubicacion;
            var fotourl = fp.replace(' ', '+');
            fotourl = 'https://practica1-g25-imagenes.s3.us-east-2.amazonaws.com/' + fotourl;
            this.state.ubicacion = fotourl;
            console.log(this.state.ubicacion);
            imagen = fotourl;
            this.state.nombreImagen = response.data[0].nombreFoto;
            this.state.descripcion = response.data[0].descripcion;
            console.log(this.state.nombreImagen + ' ' + this.state.descripcion);
        })
        .catch(error=>{
            console.error("error")
        })
    }

    Nombre(){
        var aux = [];
        aux = this.state.ubicacion.split('/');
        console.log(aux[4])
        var aux2 = [];
        aux2 = aux[4].split('_');
        console.log(aux2);
        var aux3 = [];
        aux3 = aux2[2].split('.');
        console.log(aux3[0]);
        this.state.nombreImagen = aux3[0];
    }

    render(){
        const descripcion = this.state.descripcion;
        const name = this.state.nombreImagen;

        var albums = this.state.albumes.map((p,i)=>{
            return <option>{p.titulo}</option>
        });

        var fotos = this.state.fotos.map((p,i)=>{
            console.log(p);
            return <option>{p}</option>
        });

        return(
            <div>
                <div className="modal-dialog text-center">
                <div className="modal-content">
                    <form>
                        <br></br>
                    <div className="mb-3">
                            <label htmlFor="alb" className="form-label">Album</label>
                            
                            
                            <select className="form-control btn-info" id="seleccionado" name="seleccionado" onChange={this.handleChange2}>
                                        <option>Album</option>
                                        {albums}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="alb" className="form-label">Foto</label>
                            
                            
                            <select className="form-control btn-info" id="seleccionado" name="seleccionado" onChange={this.handleChange3}>
                                        <option>Foto</option>
                                        {fotos}
                            </select>
                        </div> 
                    </form>
                    <div>
                        <br></br>
                    </div>
                    </div>
                    </div>
            <div className="modal-dialog text-center">
            <div className="col-sm-8 cuadro-central">
                
                <div className="modal-content">
                    <form onSubmit={this._handleSubmit}>
                        <div className="col-12 user-img">
                            <img src={imagen}></img>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nombreImg" className="form-label">Nombre de imagen</label>
                            <br></br>
                            <label htmlFor="imagen" className="form-label">{name}</label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desImg" className="form-label">Descripcion de la imagen: </label>
                            <p htmlFor="Descripcion" className="form-label">{descripcion}</p>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="des" className="form-label">Idioma</label>
                            <select className="form-control btn-info" id="seleccionado" name="seleccionado" onChange={this.handleChange}>
                                        <option>Seleccionar idioma</option>
                                        <option>Francés</option>
                                        <option>Italiano</option>
                                        <option>Coreano</option>
                                        <option>Ruso</option>
                                        <option>Inglés</option>
                                        <option>Español</option>
                            </select>   
                        </div>
                        <button type="submit" className="btn btn-dark">Traducir</button>
                        </form>
                        <a href="/fotos">-Regresar</a>
                    <div>
                        <br></br>
                    </div>
                    </div>
            </div>
        </div>
        </div>
        );
    }


    handleChange=async e=>{
        e.persist();
        await this.setState({
            traducirA:{
                ...this.state.traducirA,
                [e.target.name]: e.target.value
            }
        });
        console.log("idioma seleccionado");
        console.log(this.state.traducirA.seleccionado);
    }

    handleChange2=async e=>{
        e.persist();
        await this.setState({
            album:{
                ...this.state.album,
                [e.target.name]: e.target.value
            }
        });
        console.log("album seleccionado");
        console.log(this.state.album.seleccionado);
        this.Ordenar();
    }

    handleChange3=async e=>{
        e.persist();
        await this.setState({
            foto:{
                ...this.state.foto,
                [e.target.name]: e.target.value
            }
        });
        console.log("foto seleccionado");
        console.log(this.state.foto.seleccionado);
        this.RecFoto();
    }

    _handleSubmit = (e) =>{
        e.preventDefault();
        this.Traducir();
    }

    elegir=async e=>{
        console.log(".");
        console.log("album: " + this.state.album.seleccionado + " foto: " + this.state.foto.seleccionado);
    }
}