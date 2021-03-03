import React, { Component } from 'react';
import '../css/Register.css'
import MenuPrincipal from '../components/MenuPrincipal';
import SubirFoto from '../components/SubirFoto';

export default class UploadPhoto extends Component {

    render() {
        return (
            <>
            <MenuPrincipal />
            <SubirFoto />
            </>
        )
    }
}

