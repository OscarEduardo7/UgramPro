import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import request from 'superagent';
import md5 from 'md5';
import user from '../img/user.png';
import swal from 'sweetalert';

const url = "http://18.191.164.43:9000/albumes2";
const url2 = "http://18.191.164.43:9000/subirFoto2";
const url3 = "http://18.191.164.43:9000/guardarFotos";
const url4 = "http://18.191.164.43:9000/detectaretiquetas";
const na = "http://18.191.164.43:9000/newAlbum";
const cookies = new Cookies();
let enBase64 = '';
let imagen = user;
let filtr = [];
let ext = '';

export default class SubirFoto extends Component{

    state = {
        userName: '',
        imagenBase64: '',
        nombreImagen: '',
        descripcion: '',
        album:'',
        tags: [],
        albumes: [],
        agregarA:{
            seleccionado: '',
        }
    }

    Comprobacion(){
        if(this.state.userName != '' && this.state.nombreImagen != ''  && this.state.imagenBase64 != '' && ext != '' && this.state.descripcion != ''){
            this.ObtenerTags();
        }else{
            swal({
                title: "Error",
                text: "Llenar todos los campos",
                icon: "error",
                button: "Aceptar"
            });
        }
    }

    RecuperarAlbumes=async()=>{
        axios.post(url,{userName: this.state.userName})
        .then(response=>{
            console.log('respuesta');
            console.log(response.data);
            //this.state.albumes = (JSON.parse(response.text)).Items;
            const alb = (response.data).Items;
            console.log(alb);
            this.setState({
                albumes: alb
            });
            //this.state.albumes = alb;
            console.log("albumes");
            console.log(this.state.albumes);
        })
        .catch(error=>{
            console.error("error")
        })
    }

    componentDidMount(){
        if(!cookies.get('userName')){
            window.location.href='./';
        }
        this.state.userName = cookies.get("userName");
        console.log('usuario: ' + this.state.userName);
        this.RecuperarAlbumes();
    }

    ObtenerTags=async()=>{
        axios.post(url4,{imagen: this.state.imagenBase64})
        .then(response=>{
            console.log(response.data)
            this.state.tags = response.data.Labels;
            console.log(this.state.tags)
            this.RecorrerTags();
        })
        .catch(error=>{
            console.error("error tags "+ error)
        })
        
    }

    RecorrerTags(){
        //guardar en los primeros 5 tags
        let limit = 6;
        if (this.state.tags.length < 5){
            limit = this.state.tags.length;
        }
        for (var i = 0; i < limit; i++) {
            //this.GuardarFoto(this.state.tags[i]);
            let tag = this.state.tags[i].Name;
            console.log(tag);
            //console.log(this.state.tags[i].Name);
            this.CrearAlbum(tag);
            this.GuardarFoto(tag);
        }
    }

    CrearAlbum=async(tag)=>{
        let nuevo = tag;
        let existe = "no";
        for(let i = 0; i < this.state.albumes.length; i++){
            let v = this.state.albumes[i].titulo;
            if(v == nuevo){
                existe = "si";
                break;
            }
        }

        if("no" == existe){
            axios.post(na,{userName: cookies.get("userName"), titulo: tag})
            .then(response=>{
                console.log("album creado")
            })
            .catch(error=>{
                console.error(error);
            });
        }else{
            console.log("el album ya existe")
        }
    }

    GuardarFoto=async(tag)=>{
        console.log('guardar foto');
        axios.post(url2, {nombreImagen: this.state.nombreImagen, imagenBase64: this.state.imagenBase64, extension: ext, userName: this.state.userName, album: tag})
        .then(response=>{
            console.log('response.data');
            console.log(response.data);
            if (response.data == "correcto"){
                console.log('foto guardada');
                this.GuardarFotoenBD(tag);
            }else{
                console.log('error al guardar la foto');
            }
        })
        .catch(error=>{
            console.log("error")
        })
    }

    GuardarFotoenBD=async(tag)=>{
        console.log('guardar foto en tabla');
        axios.post(url3, {idFoto: this.state.userName + '_' + tag + '_' + this.state.nombreImagen, userName: this.state.userName, album: tag, nombreI: this.state.nombreImagen, ubicacion: 'Fotos_Publicadas/' + this.state.userName + '_' + tag + '_' + this.state.nombreImagen + '.' + ext, descripcion: this.state.descripcion})
        .then(response=>{
            if(response.data == "success"){
                console.log('foto guardada en la tabla');
                swal({
                    title: "Exitoso",
                    text: "Foto guardada",
                    icon: "success",
                    button: "Aceptar"
                });
            }else{
                console.log('error al guardar foto en tabla');
            }
        })
    }

    render(){
        let usuario = cookies.get("userName");
        /*var datos = this.state.albumes.map((p,i)=>{
            return <li key={i}>{p.titulo}</li>
        });
*/
        var datos2 = this.state.albumes.map((p,i)=>{
            return <option>{p.titulo}</option>
        });
/*
        for (var i = 0; i < filtr.length; i++) {
            return <option>{filtr[0][1]}</option>
        }*/
        
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
                    <form onSubmit={this._handleSubmit}>
                        <div className="col-12 user-img">
                            <img src={imagen}></img>
                        </div>
                        <div className="mb-3">
                            <div id="div_file">
                                <label id="texto">Cargar Foto</label>
                                <input type="file" id="Photo" accept="image/png, image/jpeg" multiple onChange={(e)=>convertirBase64(e.target.files)}></input>   
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombreImg" className="form-label">Nombre de imagen</label>
                            <input onChange={e => this.setState({nombreImagen: e.target.value})} type="text" className="form-control" id="nombreImg" placeholder="Nombre de imagen" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="des" className="form-label">Descripcion</label>
                            <input onChange={e => this.setState({descripcion: e.target.value})} type="text" className="form-control" id="desc" placeholder="Descripcion de la imagen" />                          
                        </div>
                        <button type="submit" className="btn btn-dark">Subir</button>
                        </form>
                        <a href="/">-Regresar</a>
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
        this.state.imagenBase64 = enBase64;  
        this.Comprobacion();
    }

    //#5bc0de
    //#46b8da

    handleChange=async e=>{
        e.persist();
        await this.setState({
            agregarA:{
                ...this.state.agregarA,
                [e.target.name]: e.target.value
            }
        });
        console.log("album seleccionado");
        console.log(this.state.agregarA.seleccionado);
    }
}