import React, { Component } from 'react';
import '../css/Register.css'
import MenuPrincipal from '../components/MenuPrincipal';
import VerFotos from '../components/VerFotos';

export default class UploadPhoto extends Component {

    render() {
        return (
            <>
            <MenuPrincipal />
            <VerFotos />
            </>
        )
    }
}