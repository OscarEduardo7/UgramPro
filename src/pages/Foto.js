import React, { Component } from 'react';
import '../css/Register.css'
import MenuPrincipal from '../components/MenuPrincipal';
import DetalleFoto from '../components/DetalleFoto';

export default class Foto extends Component {

    render() {
        return (
            <>
            <MenuPrincipal />
            <DetalleFoto />
            </>
        )
    }
}