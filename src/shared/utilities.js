// messages.js

const greetingMessage = "Bienvenidos a Ausentismos online. Para notificar su ausencia via online puede dirigirse a: https://front-ausentismo.vercel.app/ Si quiere notificar la ausencia por este medio indique *OK*. En el caso de que quiera salir presione *S*";
const avisoNotificacion = "*Importante!* Este aviso no exime del cumplimiento de los plazos legales, ni de las autorizaciones, en el caso de que correspondan ser gestionadas previamente."
const byeMessage = "Gracias por comunicarse con ausentismos online!";
const dniMessage = "Por favor indique numero de *DNI*:";
const errorDni = "Disculpa! El DNI que indicaste tiene un error. ";
const dniAceptado = "Gracias por indicar tu dni";
const userNoEncontrado = "No encontramos tu dni. Esta bien escrito?";
const tituloBoton = "Motivo Ausencia: enfermedad u otras causas";
const ausencia ="Elija: Enfermedad u Otro";
const nombre = "Ingrese su nombre";
const apellido = "Ingrese su apellido";
const email = "Ingrese su email";
const legajo = "Ingrese su legajo, 0 si no tiene";
const direccion = "Ingrese su dirección real actual";
const celular = "Ingrese su celular";
const test = "Mensaje de prueba";
const errorProvincia = "Por favor elija con el numero la provincia";
const errorLocalidad = "Por favor elija con el numero la localidad";
const errorSucursal = "Por favor elija con el numero la sucursal";
const errorEmail = "El email no es valido. Ingrese nuevamente su email";
const enfermedad = "Por favor indique presunta enfermedad";
const sintomas = "Por favor indique sus sintomas";
const medicacion = "Indique la medicación que toma";
const imagen = "Por favor adjunte la imagen";
const registro = "Tu notificación ya fue cargada. Tu número de referencia es: ";
const saludo = "Gracias por tu aviso! Que tengas un buen día";
const registrarUser = "Te pediremos algunos datos para registrarte en el sistema";
const registroExitoso = "Se registro correctamente el user."
const saludo_vuelta = "Vuelva a iniciar el proceso. Presione Ok. Gracias";
const motivo = "Por favor indique el motivo de la ausencia: ";
const volver = "Bien va tener que iniciar el proceso de vuelta.";
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

function generateIncidencia(userState){
    const certificado = userState.certificado == 'SI' ? true : false;
    const asistencia = userState.asistencia == 'SI' ? true : false;

    const user = {
        nombre: userState.nombre + " " + userState.apellido,
        email: userState.email,
        legajo: userState.legajo,
        direccion: userState.direccion,
        celular: userState.celular,
        enfermedad: userState.enfermedad,
        sintomas: userState.sintomas,
        medicacion: userState.medicacion,
        asistencia: asistencia,
        certificado: certificado,
        idUser: userState.user.id,
        idSucursal: userState.idSucursal,
        nombreSucursal: userState.nombreSucursal,
        idImagen: userState.certificado_id,
        idEmpresa:userState.empresa_id
      };

      return user;
}

function generateIncidenciaNo(userState){
    const certificado = userState.certificado == 'SI' ? true : false;
      /*  {
"nombre":"Jgg",
"email":"Gh@gm.com",
"legajo":"0",
"direccion":"Fy",
"celular":"68",
"motivo":"Ghi",
"certificado":false,
"idUser":2,
"idSucursal":52,
"nombreSucursal":"Sucursal 44 - RESISTENCIA",
"idImagen":"0"
} */

    const user = {
        nombre: userState.nombre + " " + userState.apellido,
        email: userState.email,
        legajo: userState.legajo,
        direccion: userState.direccion,
        celular: userState.celular,
        motivo: userState.motivo,    
        certificado: certificado,
        idUser: userState.user.id,
        idSucursal: userState.idSucursal,
        nombreSucursal: userState.nombreSucursal,
        idImagen: userState.certificado_id,
        idEmpresa:userState.empresa_id
      };

      return user;
}

function generateUser(userState){
    
    const user = {
        nombre: userState.nombre,
        apellido: userState.apellido,
        email: userState.email,
        dni: userState.dni,
        rol: "empleado",
        empresaId: userState.empresa_id
      };

      return user;
   
}



function getUser(userState){
    const resumen = `Usuario a registrar: 
    Empresa:${userState.empresa}
    Nombre:${userState.nombre}
    Apellido:${userState.apellido}
    Email: ${userState.email}
    Celular: ${userState.celular}
                                    
    `;
    return resumen;
}
function getResumenIncidencia(userState){
    const resumen = `Resumen Aviso Notificación:
    Empresa:${userState.empresa}
    Nombre Completo: ${userState.nombre} ${userState.apellido}
    Email: ${userState.email}
    Celular: ${userState.celular}
    Sucursal: ${userState.nombreSucursal}
    Enfermedad: ${userState.enfermedad}
    Sintomas: ${userState.sintomas}
    Medicación: ${userState.medicacion}
    Recibio Asistencia?: ${userState.asistencia}
    Tiene Certificado?: ${userState.certificado}                                     
    `;
    return resumen;
}

function getResumenIncidenciaNo(userState){
    const resumen = `Resumen Aviso Notificación:
    Empresa:${userState.empresa}
    Nombre Completo: ${userState.nombre} ${userState.apellido}
    Email: ${userState.email}
    Celular: ${userState.celular}
    Sucursal: ${userState.nombreSucursal}
    Motivo: ${userState.motivo}
    Tiene Certificado?: ${userState.certificado}                                     
    `;
    return resumen;
}


module.exports = {
    GetTextUser,
    generateIncidencia,
    generateIncidenciaNo,
    getResumenIncidencia,
    getResumenIncidenciaNo,
    getUser,
    generateUser,
    greetingMessage,
    avisoNotificacion,
    tituloBoton,
    test,
    dniMessage,
    errorDni,
    dniAceptado,
    userNoEncontrado,
    nombre,
    apellido,
    ausencia,
    email,
    legajo,
    direccion,
    celular,
    userJson,
    errorProvincia,
    errorLocalidad,
    errorSucursal, 
    errorEmail,   
    enfermedad,
    sintomas,
    medicacion,
    imagen,
    saludo,
    registro,
    motivo,
    byeMessage,
    saludo_vuelta,
    registrarUser,
    registroExitoso,
    volver
}