import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookiess = new Cookies();

export default class MenuPrincipal extends Component {
    state = {
        isOpen: false
      };
    
    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    CerrarSesion=()=>{
        cookiess.remove('userName', {path: "/"});
        cookiess.remove('nombre', {path: "/"});
        cookiess.remove('apellido', {path: "/"});
        cookiess.remove('contra', {path: "/"});
        window.location.href='./';
    }

    render(){
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
        <a className="navbar-brand" href="#">
            <img src="https://cdn.worldvectorlogo.com/logos/u-bahn.svg" alt="" width="30" height="24" className="d-inline-block align-top"/>
        GRAM
        </a>
        <div className="dropdown" onClick={this.toggleOpen}>
	    <button
            className="btn btn-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            >
            Opcion
	    </button>
        <div>
        <div className={menuClass} aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="./profile">
                Mi perfil
            </a>
            <a className="dropdown-item" href="./fotos">
                Ver fotos
            </a>
            <a className="dropdown-item" href="./upload">
                Subir fotos
            </a>
            <a className="dropdown-item" href="#" onClick={()=>this.CerrarSesion()}>
                Cerrar Sesion
            </a>
        </div>
        </div>
        </div>
        </div>
        </nav>
        )
    }
}
