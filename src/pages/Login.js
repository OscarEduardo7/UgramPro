import React, { Component } from 'react';
import user1 from '../img/user.png';
import {Form, Button, FormGroup} from 'react-bootstrap';
import '../css/Login.css'
import Menu from '../components/Menu'
import FormLogin from '../components/FormLogin';

export default class Login extends Component {
    state={ email: '', password: ''};

    handleClick(e){
        //primero evitamos que el boton recargue
        e.preventDefault()
        const correo = document.getElementById('correoU').value
        const contra = document.getElementById('passU').value
        this.setState={ email: correo, password: contra}
    }

    render() {
        return (
            <>
            <Menu />
            <FormLogin />
            </>
        )
    }
}

