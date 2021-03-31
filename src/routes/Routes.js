import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
//importamos nuestras pagias
import Login from '../pages/Login'
import LoginC from '../pages/LoginC'
import Consumiendo from '../components/ConsumiendoGet'
import Profile from '../pages/Profile';
import Registo from '../pages/Registro';
import UploadPhoto from '../pages/UploadPhoto';
import Fotos from '../pages/Fotos';
import Chat from '../pages/Chat';


//rutas creadas LOGIN
//ruta de prueba app
function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/prueba" component={Consumiendo}/>
                <Route exact path="/register" component={Registo}/>
                <Route exact path="/upload" component={UploadPhoto}/>
                <Route exact path="/fotos" component={Fotos}/>
                <Route exact path="/camLogin" component={LoginC}/>
                <Route exact path="/chatbot" component={Chat}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;