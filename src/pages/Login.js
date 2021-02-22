import React, { Component } from 'react';
import user1 from '../img/user.png';
import {Form, Button} from 'react-bootstrap';
import '../css/Login.css'

export default class Login extends Component {
    render() {
        return (
            <div class="modal-dialog text-center">
                <div class="col-sm-8 cuadro-central">
                    <div class="modal-content">
                        <div class="col-12 user-img">
                            <img src={user1}></img>
                        </div>

                        <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="E-mail" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox">
                        </Form.Group>
                        <Button variant="outline-dark" type="submit">
                            Ingresar
                        </Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

