import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import request from 'superagent';
import md5 from 'md5';
import user from '../img/user.png';
import swal from 'sweetalert';

const url = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/albumes2";
const url2 = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/subirFoto2";
const url3 = "http://p1-2127715980.us-east-2.elb.amazonaws.com:9000/guardarFotos";
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
        album:'',
        albumes: [],
        agregarA:{
            seleccionado: '',
        }
    }

    /*Filtar(alb){
        var filtrado = alb.map((p,i)=>{
            //return {p.titulo};
            if(p.idUser == this.state.userName){
                var algo = [];
                algo.push(p.id);
                algo.push(p.titulo);
                filtr.push(algo);
            }
        });
        console.log(filtr);
    //    for (var i = 0; i < filtr.length; i++) {
      //      n += i;
        //    mifuncion(n);
        // }
        console.log(JSON.stringify(filtr));
    }*/

    Comprobacion(){
        if(this.state.userName != '' && this.state.nombreImagen != ''  && this.state.imagenBase64 != '' && this.state.agregarA.seleccionado != '' && ext != ''){
            this.GuardarFoto();
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
        console.log('usuario' + this.state.userName);
        this.RecuperarAlbumes();
        /*request
            .get(url, {idUser: this.state.userName})//'http://localhost:9000/todos')
            .end((err, res) => {
                console.log(JSON.parse(res.text))
                //Revisar el json, que atributo tiene el array
                const personasU = (JSON.parse(res.text)).Items;
                console.log(personasU);
                this.setState({
                    albumes: personasU
                });
                //this.Filtar(personasU);
            });*/
    }

    GuardarFoto=async()=>{
        console.log('guardar foto');
        axios.post(url2, {nombreImagen: this.state.nombreImagen, imagenBase64: this.state.imagenBase64, extension: ext, userName: this.state.userName, album: this.state.agregarA.seleccionado})
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
        axios.post(url3, {idFoto: this.state.userName + '_' + this.state.agregarA.seleccionado + '_' + this.state.nombreImagen, userName: this.state.userName, album: this.state.agregarA.seleccionado, nombreI: this.state.nombreImagen, ubicacion: 'Fotos_Publicadas/' + this.state.userName + '_' + this.state.agregarA.seleccionado + '_' + this.state.nombreImagen + '.' + ext})
        .then(response=>{
            if(response.data == "success"){
                console.log('foto guardada en la tabla');swal({
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
                            <label htmlFor="alb" className="form-label">Album</label>
                            
                            
                            <select className="form-control btn-info" id="seleccionado" name="seleccionado" onChange={this.handleChange}>
                                        <option>Album</option>
                                        {datos2}
                            </select>
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