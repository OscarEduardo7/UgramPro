import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import md5 from 'md5';
import user from '../img/user.png';

const url = '';
const cookies = new Cookies();
let enBase64 = '';
let imagen = user;

export default class SubirFoto extends Component{

    state = {
        userName: '',
        imagenBase64: '',
        nombreImagen: '',
        album:''
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
                    enBase64 = aux[1];
                    console.log(enBase64);
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
                            
                            
                            <select class="form-control btn-info" id="exampleSelect1">
                                        <option>Category</option>
                                        <option>CATE</option>
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
    }

    //#5bc0de
    //#46b8da

}