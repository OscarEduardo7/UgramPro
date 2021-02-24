import React, { Component } from 'react';

export default class Menu extends Component {
    render(){
        return(
            <nav className="navbar navbar-dark bg-dark">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">
                  <img src="https://cdn.worldvectorlogo.com/logos/u-bahn.svg" alt="" width="30" height="24" className="d-inline-block align-top"/>
                GRAM
                </a>
              </div>
            </nav>
        )
    }
}
