import React, { Component } from 'react';
import '../css/Login.css'
import Menu from '../components/Menu'
import FormLogin from '../components/FormLogin';

export default class Login extends Component {

    render() {
        return (
            <>
            <Menu />
            <FormLogin />
            </>
        )
    }
}

