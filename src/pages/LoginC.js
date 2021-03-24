import React, { Component } from 'react';
import '../css/Login.css'
import Menu from '../components/Menu'
import LoginCamara from '../components/LoginCamara';

export default class Login extends Component {

    render() {
        return (
            <>
            <Menu />
            <LoginCamara />
            </>
        )
    }
}

