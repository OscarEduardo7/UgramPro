import React, { Component } from 'react'
import MenuPrincipal from '../components/MenuPrincipal'
import LexChat from "react-lex";

export default class Chat extends Component {
    render() {
        return (
            <div>
                <MenuPrincipal/>
                <div className="salto"></div>
                <div className="container-lg">
                <div className="card text-center">
                    <div className="col1">
                        <h1>Asistencia</h1>
                        <p>Puedes realizar tus consultas en el siguiente chat:</p>
                        <textarea readOnly name="bot" rows="10" cols="70"></textarea>
                        <br></br>
                        <input type="text" size="60" name="mensaje"></input>
                        <h4> </h4>
                        <button className="btn btn-primary"> Enviar</button>
                        <br></br>
                        <br></br>
                    </div>
                </div>
                <div className="salto"></div>
                </div>
                <LexChat botName="OrderFlowers"
                 IdentityPoolId="us-east-1:7292b8c0-56f1-4441-b2a6-xxxxxxxxxxxx"
                 placeholder="Enviar..."
                 style={{position: 'absolute'}}
                 backgroundColor="#FFFFFF"
                 height="250px"
                 region="us-east-1"
                 headerText="Asistencia" />
            </div>
        )
    }
}
