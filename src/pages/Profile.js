import React, { Component } from 'react'
import '../css/Profile.css'
import Cookies from 'universal-cookie';
import MenuPrincipal from '../components/MenuPrincipal'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ModalTitle } from 'react-bootstrap';
import axios from 'axios';
import md5 from 'md5';
import swal from 'sweetalert';
import { timers } from 'jquery';

const cookiess = new Cookies();
const Surl = "http://localhost:9000/editarUsuario";

export default class Profile extends Component {
    
    state={
        data:[],
        modalEditar: false,
        form:{
            userName: '',
            nombre: '',
            apellido: '',
            contra: ''
        }
    }

    handleChange=async e=>{
        e.persist();
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        //console.log(this.state.form);
    }

    modaEditarEstado=()=>{
        this.setState({modalEditar: !this.state.modalEditar})
    }
    componentDidMount(){
        if(!cookiess.get('userName')){
            window.location.href='./';
        }
    }

    //EDITAR PERFIL
    EditarPerfil=async()=>{
        // Revisar si las contraseñas son correctas.
        let contraA = md5(this.state.form.contra);
        let contraP = cookiess.get("contra");
        //si son iguales que actualice
        if(contraA == contraP){
            console.log(this.state.form);
            axios.put(Surl,{userName: cookiess.get("userName"), nombre: this.state.form.nombre, apellido: this.state.form.apellido})
            .then(response=>{
                if(response.data == "Nel"){
                    swal({
                        title: "Error",
                        text: "No se pudo actualizar los datos.",
                        icon: "error",
                        button: "Aceptar"
                    });
                    //alert("No se pudo actualizar los datos.");
                    this.modaEditarEstado();
                }else{
                    swal({
                        title: "Actualizado",
                        text: "Se actualizaron los datos.",
                        icon: "success",
                        button: "Aceptar",
                        timer: "2000"
                    });
                    cookiess.set('userName', cookiess.get("userName"), {path: "/"});
                    cookiess.set('nombre', this.state.form.nombre, {path: "/"});
                    cookiess.set('apellido', this.state.form.apellido, {path: "/"});
                    setTimeout('document.location.reload()',1000);
                    
                }
            })
            .catch(error=>{
                console.error("error");
                swal({
                    title: "Error",
                    text: "Ha ocurrido un error.",
                    icon: "error",
                    button: "Aceptar"
                });
            })
        }else{
            swal({
                title: "Error",
                text: "La contraseña es incorrecta.",
                icon: "error",
                button: "Aceptar"
            });
        }
    }


    render() {
        let usuario = cookiess.get("userName");
        let nombre = cookiess.get("nombre");
        let apellido = cookiess.get("apellido");

        return (
            <div>
                <>
                <MenuPrincipal/>
                </>
                <div className="salto"></div>
                <div className="container-lg">
                <div className="card text-center">
                    <div className="col1">
                        <img  className="fotoPerfil border border-3" src="https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg"></img>
                    </div>
                    <div className="usuario">
                    <h2>{ usuario }</h2>
                    </div>
                    <div className="salto"></div>
                    <div className="col2">
                        <p><b>Nombre Completo:</b> { nombre } { apellido}</p>
                        <p><b>Estado:</b> Este es mi estado </p>
                    </div>
                    <div className="salto"></div>
                    <div className="row justify-content-md-center">
                        <div className="col-lg-3">
                        <button type="button" class="btn btn-info btn-lg btni">Ver fotos</button>
                        </div>
                        <div className="col-md-auto">
                        <button type="button" class="btn btn-info btn-lg btni">Editar Albumes</button>
                        </div>
                        <div className="col-md-auto">
                        <button type="button" class="btn btn-info btn-lg btni" onClick={()=>this.modaEditarEstado()}>Editar Perfil</button>
                        </div>
                        <div className="col-lg-3">
                        <button type="button" class="btn btn-info btn-lg btni">Subir Fotos</button>
                        </div>
                    </div>
                    <div class="salto"></div>
                </div>
                <div class="salto"></div>
                </div>

                <Modal isOpen={this.state.modalEditar}>
                    <ModalTitle>Editar Perfil</ModalTitle>
                    <ModalHeader style={{display: 'block'}}>
                        
                    </ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div className="row">
                                <div className="col-8">
                                    <div className="form-group">
                                        <label htmlFor="userName">Usuario</label>
                                        <input className="form-control" type="text" name="userName" id="userName" width="50" placeholder={usuario} readOnly onChange={this.handleChange}/>
                                        <br></br>
                                        <label htmlFor="userNombre">Nombre</label>
                                        <input className="form-control" type="text" name="nombre" id="nombre" placeholder={nombre} onChange={this.handleChange}/>
                                        <br></br>
                                        <label htmlFor="userNombre">Apellido</label>
                                        <input className="form-control" type="text" name="apellido" id="apellido" placeholder={apellido} onChange={this.handleChange}/>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <img  className="fotoPerfil2 border border-3" src="https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg"></img>
                                    <br></br>
                                    <div className="div_img">
                                        <p className="texto">Cambiar Foto</p>
                                    <input className="btn_subir" accept="image/png,image/jpeg" type="file" name="file" id="btn_subir"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="salot"></div>
                        <div className="col">
                            <br></br>
                            <label htmlFor="userName">Confirmar Contraseña</label>
                            <input className="form-control" type="password" name="contra" id="contra" onChange={this.handleChange}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-info" onClick={this.EditarPerfil}>
                            Guardar Cambios
                        </button>
                        <button className="btn btn-dark" onClick={()=>this.modaEditarEstado()}>
                        Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}