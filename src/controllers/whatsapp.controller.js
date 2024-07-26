const fs = require('fs');
require('dotenv').config();
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
const whatsappService = require("../services/whatsappService");
const utilities = require("../shared/utilities");
const usersState = {}; // Aquí almacenamos el estado de cada usuario
//deberiamos eliminar el estado pasado x tiempo
const model = require("../shared/models");



const test = async(req, res) => {
   // const user =await whatsappService.findProvincia(1079);
   //const user = await whatsappService.findLocalidad(141);
   const botonEleccion = model.modelButtonGeneric(3543604130, "Recibio Asistencia:", ["SI", "NO"]);
   //const list = user.map((prov, index) => { return {id:index + 1, name:prov.nombre}});
    // const resultString = user.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');

    //console.log(JSON.stringify(resultString));
    //process.stdout.write(resultString)

    res.send(botonEleccion)
}

const verifyToken = (req, res) => {
    

    try {
        let accessToken = process.env.accessToken;
        console.log(accessToken);
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
        if (challenge != null && token != null & token == accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }

    } catch (ex) {
        console.log("Ex Verify: " + ex);
        res.status(400).send();
    }

}

const receiveMessage = async(req, res) => {
    try {
        

        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];        
        let value = changes["value"];
        let messages = value["messages"];
        console.log(messages);


        if (typeof messages != "undefined") {
            const messageValue = messages[0];
            const number = messageValue["from"];
            const text = utilities.GetTextUser(messageValue);
            console.log(text);
            const currentTime = new Date().getTime();
            if (!usersState[number]) {
                usersState[number] = { step: 1, timestamp: currentTime };
            } else {
                const lastInteractionTime = usersState[number].timestamp;
                const timeDifference = currentTime - lastInteractionTime;
                // 20 minutes in milliseconds
                const twentyMinutes = 20 * 60 * 1000;
                // If more than 20 minutes have passed, reset the step
                if (timeDifference > twentyMinutes) {
                    usersState[number] = { step: 1, timestamp: currentTime };
                }
            }

            const userState = usersState[number];
            //console.log("numero: " + number + " estado: " + userState);
            console.log(userState);
            switch (userState.step) {
                // Bienvenidos a Ausentismos Online
                case 1:{                    
                    userState.user = JSON.parse(utilities.userJson); //remeber to remove this line of code when its prodcution
                    userState.nombreApellido = "John Doe";
                    userState.email = "john.doe@example.com";
                    userState.legajo = "12345";
                    userState.direccion = "123 Main St";
                    userState.celular = "1234567890";
                    userState.enfermedad = "Colicos";
                    userState.sintomas = "Dolor de panza";
                    userState.medicacion = "Antinflamatorio";                                      
                    userState.idSucursal = 101;
                    userState.nombreSucursal = "Olmos";
                    userState.certificado_id = "0";
                    
                    const modelGreeting = model.modelText(number, utilities.greetingMessage);
                    whatsappService.sendMessage(modelGreeting);
                    userState.step = 2;
                    break;
                }
                // Por favor indique numero de DNI
                case 2:
                    {
                    const modelDni = model.modelText(number, utilities.dniMessage);
                    whatsappService.sendMessage(modelDni);
                    userState.step = 3;
                    break;
                    }
                case 3:{
                    
                    //userState.name = text;
                    //here i have to see if dni is a number or not if tis not a number
                    // i have to send a message to repeat 
                    //const dni = Number.parseInt(text)
                    // Check if the conversion resulted in a valid number
                    if (whatsappService.isNumeric(text)) {
                        //Traer el dni del usuario
                        const user = await whatsappService.findByDni(text)                    
                        if(user){
                            userState.user = user;
                            const botonEleccion = model.modelButtonAusencia(number, utilities.tituloBoton);                           
                            whatsappService.sendMessage(botonEleccion);

                            userState.step = 4;
                        }else{
                            const dniNoEncontrado = model.modelText(number, utilities.userNoEncontrado);
                            whatsappService.sendMessage(dniNoEncontrado); 
                            userState.step = 1;                           
                        }                      
                                              
                    } else {

                        const errorDni = model.modelText(number, utilities.errorDni);
                        const modelDni = model.modelText(number, utilities.dniMessage);
                        whatsappService.sendMessage(errorDni);
                        whatsappService.sendMessage(modelDni);
                        userState.step = 3;

                    }               

                    break;
                }
                case 4://nombre y apellido
                {
                    if(text == "Enfermedad" || text == "Otros"){
                        userState.causa = text;                  
                        const nombreyapellido = model.modelText(number, utilities.apellido);
                        whatsappService.sendMessage(nombreyapellido);
                        userState.step = 5; 
                    }else{
                        const ausencia = model.modelText(number, utilities.ausencia);
                        whatsappService.sendMessage(ausencia);
                        userState.step = 4; 
                    }
              
                    break;
                }
                case 5: //email
                {
                    userState.nombreApellido = text;                                            
                    const email = model.modelText(number, utilities.email);
                    whatsappService.sendMessage(email);
                    userState.step = 6; 
                    break;
                }
                case 6://legajo
                {
                    userState.email = text;                                            
                    const legajo = model.modelText(number, utilities.legajo);
                    whatsappService.sendMessage(legajo);
                    userState.step = 7; 
                    break;
                }
                case 7://direccion
                {
                    userState.legajo = text;                                            
                    const dire = model.modelText(number, utilities.direccion);
                    whatsappService.sendMessage(dire);
                    userState.step = 8; 
                    break;
                }
                case 8://celular
                {
                    userState.direccion = text;                                            
                    const celular = model.modelText(number, utilities.celular);
                    whatsappService.sendMessage(celular);
                    userState.step = 9; 
                    break;
                } 
                case 9://provincia
                {
                    userState.celular = text;
                    const empresaId = userState.user.empresa.id;     
                    const provincias = await whatsappService.findProvincia(empresaId);                    
                    const title = 'Por Favor elija su provincia\n'                    
                    const resultString = provincias.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
                    userState.provincias = provincias;
                    const str_provincias_title = title + resultString;
                    const str_provincias = model.modelText(number, str_provincias_title);
                    whatsappService.sendMessage(str_provincias);
                    userState.step = 10; 
             
                    break;
                }   
                case 10://localidad
                {
                    let isValid = false;
                    if (whatsappService.isNumeric(text)) {
                       const index = (Number.parseInt(text) - 1);
                       if(index >= 0 && index < userState.provincias.length){                        
                        const idProvincia = userState.provincias[index].id;                        
                        const localidades = await whatsappService.findLocalidad(idProvincia);
                        const title = 'Por Favor elija su localidad\n'                    
                        const resultString = localidades.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
                        userState.localidades = localidades;
                        const str_localidades_title = title + resultString;
                        const str_localidades = model.modelText(number, str_localidades_title);
                        whatsappService.sendMessage(str_localidades);
                        userState.step = 11; 
                        isValid = true;
                       }
                   }
                    if (!isValid) {
                        // Handle case where the input text is not numeric or index is out of bounds
                        const provinciaNoEncontrado = model.modelText(number, utilities.errorProvincia);
                        whatsappService.sendMessage(provinciaNoEncontrado);
                        userState.step = 10;
                    }
                
                        
             
                    break;      
                }
                case 11://sucursal
                {
                    let isValid = false;
                    if (whatsappService.isNumeric(text)) {
                    const index = (Number.parseInt(text) - 1);
                       if(index >= 0 && index < userState.localidades.length){
                        const idLocalidad = userState.localidades[index].id;                        
                        const sucursales = await whatsappService.findSucursal(idLocalidad);
                        const title = 'Por Favor elija su sucursal\n'                    
                        const resultString = sucursales.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
                        userState.sucursales = sucursales;
                        const str_sucursales_title = title + resultString;
                        const str_sucursales = model.modelText(number, str_sucursales_title);
                        whatsappService.sendMessage(str_sucursales);
                         
                        
                        if(text=="Enfermedad"){

                            userState.step = 12 
                        }else{
                            userState.step = 20; 
                        }

                        isValid = true;
                       }
                   }
                    if (!isValid) {
                        // Handle case where the input text is not numeric or index is out of bounds
                        const localidadNoEncontrado = model.modelText(number, utilities.errorLocalidad);
                        whatsappService.sendMessage(localidadNoEncontrado);
                        userState.step = 11;
                    }
                    break;      
                }

                case 12://Presunta Enfermedad
                {
                    let isValid = false;
                    if (whatsappService.isNumeric(text)) {
                       const index = (Number.parseInt(text) - 1);
                       if(index >= 0 && index < userState.sucursales.length){                      
                        userState.idSucursal = userState.sucursales[index].id;  
                        userState.nombreSucursal = userState.sucursales[index].nombre;                                        
                        const enfermedad = model.modelText(number, utilities.enfermedad);
                        whatsappService.sendMessage(enfermedad);
                        userState.step = 13;                        
                        isValid = true;
                       }
                   }
                    if (!isValid) {
                        // Handle case where the input text is not numeric or index is out of bounds
                        const sucursalNoEncontrado = model.modelText(number, utilities.errorSucursal);
                        whatsappService.sendMessage(sucursalNoEncontrado);
                        userState.step = 12;
                    }
                    break;   
                }
                case 13://Sintomas
                {
                    userState.enfermedad = text;                                            
                    const enfermedad = model.modelText(number, utilities.sintomas);
                    whatsappService.sendMessage(enfermedad);
                    userState.step = 14; 
                    break;           
                    
                }
                case 14://Medicacion
                {
                    userState.sintomas = text;                                            
                    const medicacion = model.modelText(number, utilities.medicacion);
                    whatsappService.sendMessage(medicacion);
                    userState.step = 15; 
                    break;           
                    
                }
                case 15://Recibio Asistencia
                {
                    userState.medicacion = text;     
                    const botonAsistencia = model.modelButtonGeneric(number, "Recibio Asistencia:", ["SI", "NO"]);        
                    whatsappService.sendMessage(botonAsistencia);
                    userState.step = 16; 
                    break;         
                }
                case 16://Posee certificado
                {
                    userState.asistencia = text;     
                    const botonCertificado = model.modelButtonGeneric(number, "Desea adjuntar Certificado?(Foto)", ["SI", "NO"]);        
                    whatsappService.sendMessage(botonCertificado);
                    userState.step = 17; 
                    break;   
                }
                case 17://Posee certificado
                {
                    if(text == "SI"){
                        userState.certificado = text;                 
                        const adjuntarImagen = model.modelText(number, utilities.imagen);
                        whatsappService.sendMessage(adjuntarImagen);
                        userState.step = 18; 
                    }else{
                        userState.certificado = "NO"; 
                        userState.certificado_id = "0";
                        const incidencia = generateUser(userState); 
                        const saveUser = await whatsappService.postIncidencia(incidencia);
                        const saludo = utilities.saludo + saveUser; 
                        const saludo_model = model.modelText(number, saludo);
                        whatsappService.sendMessage(saludo_model);
                        userState.step = 1; 

                    }
              
                    break;

                    
                }
                case 18://Adjuntar certificado
                {
                    console.log("id certificado " + text)
                    if (whatsappService.isNumeric(text)) {
                        userState.certificado_id = text;
                        const saludo = model.modelText(number, utilities.saludo);
                        whatsappService.sendMessage(saludo);
                    }else{

                    }
                        
              
                    break;   
                }


                default:
                {
                        //direccion{}
                    const test1 = model.modelText(number, utilities.test);                    
                    whatsappService.sendMessage(number, test1);
                    break;

                }
                    
            }

            //console.log(messageValue);
        }

        // myConsole.log(messageValue[0]);
        //console.log(GetTextUser(messageValue[0]))
   
        res.send("EVENT_RECEIVED")
    } catch (ex) {

        myConsole.log(ex);
        res.send("EVENT_RECEIVED")
    }
}


function generateUser(userState){
    const certificado = userState.certificado == 'SI' ? true : false;
    const asistencia = userState.asistencia == 'SI' ? true : false;

    const user = {
        nombre: userState.nombreApellido,
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
        idImagen: userState.certificado_id
      };

      return user;



}



module.exports = {
    verifyToken,
    receiveMessage,
    test
}