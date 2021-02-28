export async function getPersonas (){
    const response = await fetch("http://localhost:9000/usuarios");
    const responseJson = await response.json();
    return responseJson;
}

export default{
    getPersonas
}