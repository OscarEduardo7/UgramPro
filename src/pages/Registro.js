import React, { Component } from 'react';
import '../css/Register.css'
import Menu from '../components/Menu'
import FormularioRegistro from '../components/FormularioRegistro';

export default class Registo extends Component {

    render() {
        return (
            <>
            <Menu />
            <FormularioRegistro />
            </>
        )
    }
}