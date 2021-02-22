import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import App from '../App';
//importamos nuestras pagias
import Login from '../pages/Login'


//rutas creadas LOGIN
//ruta de prueba app
function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/app" component={App}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;