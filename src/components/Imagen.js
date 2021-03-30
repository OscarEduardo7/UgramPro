import React, {useState} from 'react' 
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

const translate = "http://localhost:9000/translate";

export const Imagen = (props) => {
    const [modal, setModal] = useState(false);
    var nombreImagen = '';
    const modalImagen = ()=>{
        setModal(!modal)
        var aux = [];
        aux = props.ubicacion.split('/');
        console.log(aux[4])
        var aux2 = [];
        aux2 = aux[4].split('_');
        console.log(aux2);
        var aux3 = [];
        aux3 = aux2[2].split('.');
        console.log(aux3[0]);
        nombreImagen = aux3[0];
    }
 

    const Traducir=async()=>{
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

    return (
        <div>
            <figure className="figure tam">            
                <a title="Detalle" href="./Foto">
                    <img src={props.ubicacion} className="rou"/>
                </a>
                <button onClick={modalImagen}>Descripcion</button>
            <figcaption className="figure-caption text-end">Foto</figcaption>
            </figure>

            <Modal isOpen={modal}>
                <ModalHeader toggle={modalImagen} style={{display: ''}}> 
                {nombreImagen}
                </ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <img  className="fotoPerfil3 " src={props.ubicacion}></img>
                            </div>
                        </div>
                    </div>


                </ModalBody>
            </Modal>

        </div>
    )
}
