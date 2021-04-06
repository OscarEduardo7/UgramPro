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
import user from '../img/user.png';

const cookiess = new Cookies();
const Surl = "http://18.191.164.43:9000/editarUsuario";
const Aurl = "http://18.191.164.43:9000/getAlbumes";
const Curl = "http://18.191.164.43:9000/newAlbum";
const Eurl = "http://18.191.164.43:9000/deleteAlbum";
const urlUsuario = "http://18.191.164.43:9000/usuarioId";
const urlFoto = "http://18.191.164.43:9000/obtenerFoto";
const url3 = "http://18.191.164.43:9000/subirFoto";
const url4 = "http://18.191.164.43:9000/guardarFotoPerfil";

const tagsP = "http://18.191.164.43:9000/tagsProfile";
const textG = "http://18.191.164.43:9000/getTexto";


let enBase64 = '';
let enBase642 = '';
let imagen = user;
let ext = '';
let FechaHora = '';

export default class Profile extends Component {
    
    state={
        modalEditar: false,
        modalAlbum: false,
        form:{
            userName: '',
            nombre: cookiess.get('nombre'),
            apellido: cookiess.get('apellido'),
            contra: '',
            foto: ''
        },
        eliminar:{
            seleccionado: '',
        },
        album:{
        crearAlbum: '',
        },
        Albumes: [],
        miFoto: '',
        miFotoBase: '',
        resTags: [],
        fotoTexto: []
    };

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

    handleChange2=async e=>{
        e.persist();
        await this.setState({
            album:{
                ...this.state.album,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.album);
    }

    handleChange3=async e=>{
        e.persist();
        await this.setState({
            eliminar:{
                ...this.state.seleccionado,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.eliminar.seleccionado);
    }


    modaEditarEstado=()=>{
        this.setState({modalEditar: !this.state.modalEditar})
    }

    modalExtraerTexto=()=>{
        this.setState({modalAlbum: !this.state.modalAlbum})
    }

    componentDidMount(){
        if(!cookiess.get('userName')){
            window.location.href='./';
        }
        //this.ObtenerAlbum();
        this.Usuario();
    }


    //EDITAR PERFIL
    EditarPerfil=async()=>{

        this.state.form.foto = enBase64;
        var fechahora = new Date();
        var fecha = fechahora.getDate() + '-' + (fechahora.getMonth() + 1) + '-' + fechahora.getFullYear();
        var hora = fechahora.getHours() + ':' + fechahora.getMinutes() + ':' + fechahora.getSeconds();
        FechaHora = fecha + '_' + hora;
        // Revisar si las contraseñas son correctas.
        let contraA = md5(this.state.form.contra);
        let contraP = cookiess.get("contra");
        //si son iguales que actualice
        if(contraA == contraP){
            console.log(this.state.form);
            axios.put(Surl,{userName: cookiess.get("userName"), nombre: this.state.form.nombre, apellido: this.state.form.apellido, foto: 'Fotos_Perfil/' + cookiess.get("userName") + '_' + FechaHora + '.' + ext})
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
                    //guardar foto de perfil
                    this.GuardarFoto();
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

                    setTimeout('document.location.reload()',2000);
                    
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

    GuardarFoto=async()=>{
        console.log('guardar foto');
        axios.post(url3, {nombreImagen: FechaHora, imagenBase64: this.state.form.foto, extension: ext, userName: cookiess.get('userName')})
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
        axios.post(url4, {idFoto: cookiess.get('userName') + '_' + FechaHora + '.' + ext, idUser: cookiess.get('userName'), ubicacion: 'Fotos_Perfil/' + cookiess.get('userName') + '_' + FechaHora + '.' + ext})
        .then(response=>{
            if(response.data == "success"){
                console.log('foto guardada en la tabla');
            }else{
                console.log('error al guardar foto en tabla');
            }
        })
    }

    //para editar albumes
    ObtenerAlbum=async()=>{
        axios.post(Aurl,{userName: cookiess.get("userName")})
        .then(response=>{
            if(response.data.Count == 0){
                console.log("NO HAY ALBUMES PARA ESTE USUARIO")
            }else{
                this.setState({
                    Albumes: response.data.Items
                });
                console.log("mis albumes:")
                console.log(this.state.Albumes);                
            }
        })
        .catch(error=>{
            console.error(error);
        });
    }

    //para crear albumes
    CrearAlbum=async()=>{
        let nuevo = this.state.album.crearAlbum;
        let existe = "no";
        for(let i = 0; i < this.state.Albumes.length; i++){
            let v = this.state.Albumes[i].titulo;
            if(v == nuevo){
                existe = "si";
                break;
            }
        }

        if("no" == existe){
            axios.post(Curl,{userName: cookiess.get("userName"), titulo: this.state.album.crearAlbum})
            .then(response=>{
                swal({
                    title: "Creado",
                    text: "El album ha sido creado.",
                    icon: "success",
                    button: "Aceptar",
                    timer: "2000"
                });
                setTimeout('document.location.reload()',1000);
            })
            .catch(error=>{
                console.error(error);
            });
        }else{
            swal({
                title: "Error",
                text: "El album ya existe.",
                icon: "error",
                button: "Aceptar",
            });
        }
    }

    //para eliminar albumes
    EliminarAlbum=async()=>{
        axios.post(Eurl,{userName: cookiess.get("userName"), titulo: this.state.eliminar.seleccionado})
        .then(response=>{
            swal({
                title: "Eliminado",
                text: "El album ha sido eliminado.",
                icon: "success",
                button: "Aceptar",
                timer: "2000"
            });
            setTimeout('document.location.reload()',1000);
        })
        .catch(error=>{
            console.error(error);
        });
    }

    //PARA LA FOTO DE PERFIL
    Usuario=async()=>{
        axios.post(urlUsuario,{userName: cookiess.get('userName')})
        .then(response=>{
            const ftp = (response.data).Items;
            console.log(ftp);
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
            console.log('mostrar foto');
            let fotoBase64 = response.data;
            console.log(fotoBase64.length);
            let ftB64 = fotoBase64;
            var aux = [];
            aux = this.state.foto.split('.');
            var ext = aux[1]
            //console.log('la extension es: ' + ext);
            fotoBase64 = 'data:image/' + ext + ';base64,' + fotoBase64;
            //console.log("la foto de perfil es esta:"+fotoBase64)
            this.setState({
                miFoto: fotoBase64
            });
            
            axios.post(tagsP,{imagen: ftB64})
            .then(response=>{
                //console.log(response.data.Deteccion.FaceDetails[0])
                //onsole.log(response.data.Deteccion.FaceDetails[0].AgeRange.Low)
                this.setState({
                    resTags: response.data.FaceDetails
                })
                console.log(this.state.resTags)
            })
            .catch(error=>{
                console.error("error tags"+error)
            })
            
        })
        .catch(error=>{
            console.error('error al convertir foto')
        })
    }

    ObtenerTexto=async()=>{
        var respuesta
        axios.post(textG,{imagen: enBase642})
        .then(response=>{
            respuesta = response.data
            console.log(respuesta)
            this.setState({
                fotoTexto: response.data
            });
        })
        .catch(error=>{
            console.error('error al obtener texto')
        })
    }


    render() {
    
        const convertirBase64=(archivos)=>{
            Array.from(archivos).forEach(archivo=>{
                var reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload=function(){
                    var aux=[];
                    var base64 = reader.result;
                    console.log("BASE64::"+base64)
                    imagen = base64;
                    console.log("a base 64");
                    console.log(imagen);
                    aux = base64.split(',');
                    enBase64 = aux[1];
                    //console.log(enBase64);
                    var aux2, aux3 = [];
                    aux2 =aux[0].split('/');
                    aux3 = aux2[1].split(';');
                    ext = aux3[0]
                    console.log('la extension es: ' + ext);
                }
            })
        }

        const convertirBase642=(archivos)=>{
            Array.from(archivos).forEach(archivo=>{
                var reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload=function(){
                    var aux=[];
                    var base64 = reader.result;
                    imagen = base64;
                    aux = base64.split(',');
                    enBase642 = aux[1];
                    var aux2, aux3 = [];
                    aux2 =aux[0].split('/');
                    aux3 = aux2[1].split(';');
                    ext = aux3[0]
                    //console.log(enBase642);
                }
            })
        }

        let fotoUrl = this.state.miFoto;
        let usuario = cookiess.get("userName");
        let nombre = cookiess.get("nombre");
        let apellido = cookiess.get("apellido");

        const etiquetas = this.state.resTags.map((item,i)=>{
            var Beard = ""
            var uno = ""
            var lentes = ""
            var genero = ""
            var bigote = ""
            var sonrisa = ""
            if(item.Smile.Value == true){
                sonrisa = "Sonriendo"
            }
            if(item.Beard.Value == true){
                Beard = "Tiene Barba"
            }
            if(item.Beard.Value == false){
                Beard = "No tiene Barba"
            }
            if(item.Mustache.Value == true){
                bigote = "Con Bigote"
            }
            if(item.Mustache.Value == false){
                bigote = "Sin Bigote"
            }
            if(item.Eyeglasses.Value == true){
                lentes = "Usa Lentes"
            }
            if(item.Eyeglasses.Value == false){
                lentes = "No usa Lentes"
            }
            if(item.Gender.Value == "Male"){
                genero = "Hombre"
            }
            if(item.Gender.Value == "Female"){
                genero = "Mujer"
            }

            if(item.Emotions[0].Type == "SAD"){
                uno = "Triste"
            }
            if(item.Emotions[0].Type == "HAPPY"){
                uno = "Feliz"
            }
            if(item.Emotions[0].Type == "ANGRY"){
                uno = "Enojado"
            }
            if(item.Emotions[0].Type == "SORPRISED"){
                uno = "Sorprendido"
            }
            if(item.Emotions[0].Type == "FEAR"){
                uno = "Temeroso"
            }
            if(item.Emotions[0].Type == "CONFUSED"){
                uno = "Confundido"
            }

            return <div key={i}>
                <span  className="badge rounded-pill bg-info">Edad: {item.AgeRange.Low}-{item.AgeRange.High}</span> 
                <span className="badge rounded-pill bg-info">{genero}</span>
                <span className="badge rounded-pill bg-info">{sonrisa}</span>
                <span className="badge rounded-pill bg-info">{uno}</span>
                <span className="badge rounded-pill bg-info">{Beard}</span>
                <span className="badge rounded-pill bg-info">{lentes}</span>
                <span className="badge rounded-pill bg-info">{bigote}</span>
                </div>
        })

        const texto = this.state.fotoTexto.map((item,i)=>{
            var r = ""
            if(item.Type == "LINE"){
                r += item.DetectedText
            }

            return <p>{r}</p>                                        

        })

        return (
            <div>
                <>
                <MenuPrincipal/>
                </>
                <div className="salto"></div>
                <div className="container-lg">
                <div className="card text-center">
                    <div className="col1">
                        <img  className="fotoPerfil border border-3" src={fotoUrl}></img>
                    </div>
                    <div className="usuario">
                    <h2>{ usuario }</h2>
                    {etiquetas}
                    </div>
                    <div className="salto"></div>
                    <div className="col2">
                        <p><b>Nombre Completo:</b> { nombre } { apellido}</p>
                        
                    </div>
                    <div className="salto"></div>
                    <div className="row justify-content-md-center">
                        <div className="col-lg-3">
                        <button type="sumit" className="btn btn-info btn-lg btni" onClick={()=>{window.location.href='./fotos';}}>Ver fotos</button>
                        </div>
                        <div className="col-md-auto">
                        <button type="sumit" className="btn btn-info btn-lg btni" onClick={()=>{window.location.href='./Foto';}}>Traducir</button>
                        </div>
                        <div className="col-md-auto">
                        <button type="button" className="btn btn-info btn-lg btni" onClick={()=>this.modaEditarEstado()}>Editar Perfil</button>
                        </div>
                        <div className="col-md-auto">
                        <button type="button" className="btn btn-info btn-lg btni" onClick={()=>this.modalExtraerTexto()}>Extraer Texto</button>
                        </div>
                        <div className="col-lg-3">
                        <button type="button" className="btn btn-info btn-lg btni"onClick={()=>{window.location.href='./upload';}}>Subir Fotos</button>
                        </div>
                    </div>
                    <div className="salto"></div>
                </div>
                <div className="salto"></div>
                </div>

                <Modal isOpen={this.state.modalEditar}>
                    <ModalHeader toggle={this.modaEditarEstado} style={{display: ''}}>
                    Editar Perfil
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
                                        <input className="form-control" type="text" name="nombre" id="nombre"  placeholder={nombre} onChange={this.handleChange}/>
                                        <br></br>
                                        <label htmlFor="userNombre">Apellido</label>
                                        <input className="form-control" type="text" name="apellido" id="apellido" placeholder={apellido} onChange={this.handleChange}/>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <img  className="fotoPerfil2 border border-3" src={imagen}></img>
                                    <br></br>
                                    <div className="div_img">
                                        <p className="texto">Cambiar Foto</p>
                                    <input className="btn_subir" accept="image/png, image/jpeg" type="file" multiple id="btn_subir" onChange={(e)=>convertirBase64(e.target.files)}/>
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

                <Modal isOpen={this.state.modalAlbum}>
                    <ModalHeader toggle={this.modalExtraerTexto} style={{display: ''}}> 
                    Extraer Texto
                    </ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <img  className="fotoPerfil3 " src={imagen}></img>
                                    <br></br>
                                    <div className="div_img">
                                        <p className="texto">Sube una foto</p>
                                    <input className="btn_subir" accept="image/png, image/jpeg" type="file" multiple id="btn_subir" onChange={(e)=>convertirBase642(e.target.files)}/>
                                    </div>
                                    <br></br>
                                </div>
                            </div>
                        </div>
                        
                        <div className="salot"></div>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        {texto}
                                        <br></br>
                                        <button className="btn btn-info" onClick={this.ObtenerTexto}>
                                            Extraer Texto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}