import React, { Component } from 'react';
import request from 'superagent';

export default class Consumiendo extends Component {
    //creamos constructor 
    constructor(){
        //hereda los componentes de react
        super();
        this.state = {
            personas: []
        }
    }


    //ESTO ES CON SUPERAGENT
    //YA SE DEBERIA DE PODER CON AXIOS
    componentDidMount(){
        request
            .get('http://localhost:9000/todos')
            .end((err, res) => {
                console.log(JSON.parse(res.text))
                //Revisar el json, que atributo tiene el array
                const personasU = (JSON.parse(res.text)).Items;
                console.log(personasU);
                this.setState({
                    personas: personasU
                });
            });
    }

   render(){

        var datos = this.state.personas.map((p,i) =>{
            return <li key={i} >{ p.nombre }, { p.id }</li>
        });

        return(
            
            <div className="modal-dialog text-center">
            <div className="col-sm-8 cuadro-central">
                <div className="modal-content">
                        <div>
                            <ul>
                                {datos}
                            </ul>
                        </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
