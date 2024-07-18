// messages.js

const greetingMessage = "Bienvenidos a Ausentismos online. Para notificar su ausencia via online puede dirigirse a: https://front-ausentismo.vercel.app/ Si quiere notificar la ausencia por este medio indique *OK*";
const dniMessage = "Por favor indique numero de *DNI*:";
const errorDni = "Disculpa! El DNI que indicaste tiene un error. ";
const dniAceptado = "Gracias por indicar tu dni";
const userNoEncontrado = "No encontramos tu dni. Por favor registrese en https://front-ausentismo.vercel.app/register";
const tituloBoton = "Ausencia por enfermedad u otras causas";
const ausencia ="Elija: Enfermedad u Otro";
const apellido = "Ingrese su nombre y apellido";
const email = "Ingrese su email";
const legajo = "Ingrese su legajo, 0 si no tiene";
const direccion = "Ingrese su dirección";
const celular = "Ingrese su celular";
const test = "Mensaje de prueba";
const errorProvincia = "Por favor elija con el numero la provincia";
const errorSucursal = "Por favor elija con el numero la sucursal";
const enfermedad = "Por favor indique presunta enfermedad";
const sintomas = "Por favor indique sus sintomas";
const medicacion = "Indique la medicación que toma";
const userJson = `
{
    "id": 3,
    "dni": 32972085,
    "nombre": "javi",
    "apellido": "jimenez",
    "role": {
        "id": 3,
        "roleName": "empleado",
        "description": "Empleados de la empresa"
    },
    "empresa": {
        "id": 1079,
        "nombre": "Carrefour",
        "razonSocial": "Carrefour",
        "createdAt": "2023-11-03T03:29:11.698Z"
    }
}`;


function GetTextUser(messages) {
    //console.log(messages);
    let text = "";
    const typeMessage = messages["type"];
    if (typeMessage == "text") {
        text = (messages["text"])["body"]

    } else if (typeMessage == "interactive") {
        const interactiveObject = messages["interactive"];
        const type = interactiveObject["type"];

        if (type == "button_reply") {
            text = (interactiveObject["button_reply"])["title"]

        } else if (type == "list_reply") {
            text = (interactiveObject["list_reply"])["title"]
        } else {
            console.log("sin mensaje")
        }
    }else if(typeMessage == "image") {
        const image = messages["image"];
        //console.log(image)
        text = image["id"]
    }else if(typeMessage == "document") {
    const document = messages["document"];
        //console.log(image)
         text = document["id"]
    }
    else{
        console.log("sin mensaje nada")
    }

    return text;
}

module.exports = {
    GetTextUser,
    greetingMessage,
    tituloBoton,
    test,
    dniMessage,
    errorDni,
    dniAceptado,
    userNoEncontrado,
    apellido,
    ausencia,
    email,
    legajo,
    direccion,
    celular,
    userJson,
    errorProvincia,
    errorSucursal,
    enfermedad,
    sintomas,
    medicacion
}