import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import App from '../App';
//importamos nuestras pagias
import Login from '../pages/Login'
import Consumiendo from '../components/ConsumiendoGet'
import Profile from '../pages/Profile';


//rutas creadas LOGIN
//ruta de prueba app
function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/app" component={App}/>
                <Route exact path="/prueba" component={Consumiendo}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;