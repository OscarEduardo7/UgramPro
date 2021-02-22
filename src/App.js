import logo from './logo.svg';
import './App.css';
//importar componentes
import Login from './pages/Login'
//exportar cosas de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button, Card, Form, Navbar} from 'react-bootstrap'


function App() {
  return (
    <div className="App">
            <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="https://react-bootstrap.github.io/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          UGRAM - Grupo 25
        </Navbar.Brand>
      </Navbar>
      <header className="App-header">
      
      <h1>UGRAM</h1>
      <h3>Practica 1 - Seminario de Sistemas 1</h3>
      <Form>
        <Form.Group>
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" placeholder="ejemplo@correo.com" />
          <Form.Text className="text-muted">
            Ingresa tu correo electronico.
          </Form.Text>
        </Form.Group>
      </Form>
      <Card style={{color:"#000"}}>
        <Card.Img src="https://c4.wallpaperflare.com/wallpaper/280/528/872/arboles-bosque-natutraleza-paisaje-wallpaper-preview.jpg"/>
        <Card.Body>
          <Card.Title>Card de ejemplo</Card.Title>
          <Card.Text>Este es un ejemplo con bootstrap</Card.Text>
          <Button variant="secondary">Leer mas</Button>
        </Card.Body>
      </Card>
      <Button>Mi boton</Button>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
