import React, { Component } from 'react';
import user1 from '../img/user.png';

export default class FormLogin extends Component {
    //creamos el state inicial del formulario
    state = {
        correo: '',
        contra: ''
    }

    //con esta funcion actualizamos el State, actualizando correo y contra con el valor actual que tiene el input
    //con target que tiene el elemento que esta causando el elemento
    //es con la funcion que esta adentro de cada input


    //hago el submit y obtengo los datos metiendolos en el state
    _handleSubmit = (e) =>{
        e.preventDefault()
        console.log(this.state)
    }
    render(){
        return(
            <div className="modal-dialog text-center">
            <div className="col-sm-8 cuadro-central">
                <div className="modal-content">
                    <div className="col-12 user-img">
                        <img src={user1}></img>
                    </div>
                        <form onSubmit={this._handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="uCorreo" className="form-label">Correo Electrónico</label>
                            <input onChange={e => this.setState({ correo: e.target.value})} type="email" className="form-control" id="uCorreo" placeholder="Correo Electrónico" aria-describedby="emailHelp"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="uContra" className="form-label">Contraseña</label>
                            <input onChange={e => this.setState({ contra: e.target.value})} type="password" className="form-control" id="uContra" placeholder="Contraseña"/>
                        </div>
                        <button type="submit" className="btn btn-dark">Iniciar Sesión</button>
                        </form>
                    <div>
                        <br></br>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
