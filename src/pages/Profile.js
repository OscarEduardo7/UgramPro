import React, { Component } from 'react'
import '../css/Profile.css'
import Cookies from 'universal-cookie';
import MenuPrincipal from '../components/MenuPrincipal'

const cookiess = new Cookies();

export default class Profile extends Component {
    
    componentDidMount(){
        if(!cookiess.get('userName')){
            window.location.href='./';
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
                <div class="salto"></div>
                <div class="container-lg">
                <div class="card text-center">
                    <div class="col1">
                        <img  class="fotoPerfil border border-4" src="https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/styles/855/public/media/image/2018/08/fotos-perfil-whatsapp_16.jpg?itok=iohCz0oN"></img>
                    </div>
                    <div class="usuario">
                    <h1>{ usuario }</h1>
                    </div>
                    <div class="salto"></div>
                    <div class="row row-cols-3">
                        <div class="col">
                            <h2>Nombre:</h2>
                            <h3>{ nombre }</h3>
                            <h2>Apellido:</h2>
                            <h3>{apellido}</h3>
                        </div>
                        <div className="col">
                        <button type="button" class="btn btn-outline-dark">Ver fotos</button>
                        <button type="button" class="btn btn-outline-dark">Subir Foto</button>
                        <button type="button" class="btn btn-outline-dark">Editar Albumes</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}