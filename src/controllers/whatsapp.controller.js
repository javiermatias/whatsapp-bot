const fs = require('fs');
require('dotenv').config();
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
const whatsappService = require("../services/whatsappService");
const utilities = require("../shared/utilities");
const usersState = {}; // Aquí almacenamos el estado de cada usuario
//deberiamos eliminar el estado pasado x tiempo
const model = require("../shared/models");
const cron = require('node-cron');
const Sentry = require("@sentry/node");


const test = async(req, res) => {
   // const user =await whatsappService.findProvincia(1079);
   //const user = await whatsappService.findLocalidad(141);
   //const botonEleccion = model.modelButtonGeneric(3543604130, "Recibio Asistencia:", ["SI", "NO"]);
   //const list = user.map((prov, index) => { return {id:index + 1, name:prov.nombre}});
    // const resultString = user.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
    try {
        throw new Error("My first Sentry error!");
      } catch (e) {
        Sentry.captureException(e);
      }
    
/*     const saveUser = await whatsappService.loginToAusentismosOnline("32972083","32972083");
    const token = saveUser.access_token;
    const user = await whatsappService.findByDni("5489481", "asa")
    if(user){
        res.send("Existe el user");
    }else{
        res.send("No existe el user")
    } */
    res.send("hola");
    //res.send(botonEleccion)
}

const verifyToken = (req, res) => {
    

    try {
        let accessToken = process.env.accessToken;
        //(accessToken);
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
        if (challenge != null && token != null & token == accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }

    } catch (ex) {
        console.log("Ex Verify: " + ex);
        Sentry.captureException(ex);
        res.status(400).send();
    }

}

const receiveMessage = async(req, res) => {
    try {
        

        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];        
        let value = changes["value"];
        let messages = value["messages"];
     


        if (typeof messages != "undefined") {
            const messageValue = messages[0];  
            const number = messageValue["from"];
            const text = utilities.GetTextUser(messageValue);
            if(text === "S" || text === "s"){
                delete usersState[number];  
            }
            const currentTime = new Date().getTime();
            if (!usersState[number]) {
                try{
                    const user = await whatsappService.loginToAusentismosOnline("32972083","32972083");
                    usersState[number] = { step: 1, timestamp: currentTime, token:user.access_token};
                }catch(e){
                    //ideal to log this error.
                    Sentry.captureException(e);
                    
                }
            
            } else {
                const lastInteractionTime = usersState[number].timestamp;
                const timeDifference = currentTime - lastInteractionTime;
                // 20 minutes in milliseconds
                const eigthMinutes = 8 * 60 * 1000;
                // If more than 20 minutes have passed, reset the step
                if (timeDifference > eigthMinutes) {
                    usersState[number] = { step: 1, timestamp: currentTime };
                }
            }

            const userState = usersState[number];
            userState.empresa_id = req.empresa.id;
            userState.empresa = req.empresa.nombre;
            //console.log("numero: " + number + " estado: " + userState);
            console.log(userState);
            switch (userState.step) {
                // Bienvenidos a Ausentismos Online
                case 1:{                    
                /*     userState.user = JSON.parse(utilities.userJson); //remeber to remove this line of code when its prodcution
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
                    userState.certificado_id = "0"; */
                    
                    const modelGreeting = model.modelText(number, utilities.greetingMessage);
                    await whatsappService.sendMessage(modelGreeting);
                    userState.step = 2;
                    break;
                }

              
                // Por favor indique numero de DNI
                case 2:
                    {
                    const modelAviso = model.modelText(number, utilities.avisoNotificacion);
                    await whatsappService.sendMessage(modelAviso);
                    const modelDni = model.modelText(number, utilities.dniMessage);
                    await whatsappService.sendMessage(modelDni);
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
                        
                        try{
                            const user = await whatsappService.findByDni(text, userState.token)
                            userState.dni = text;                    
                            if(user){
                                userState.existe_user = true;
                                userState.user = user;                            
                                const nombre = model.modelText(number, utilities.nombre);
                                 await whatsappService.sendMessage(nombre);                            
                                //const botonEleccion = model.modelButtonAusencia(number, utilities.tituloBoton);                           
                                //await whatsappService.sendMessage(botonEleccion);
    
                                userState.step = 4;
                            }else{
                                //Registrar
                                userState.existe_user = false;                           
                                const botonConfirmar = model.modelButtonGeneric(number, "No encontramos tu dni esta bien escrito?", ["SI", "NO"]);        
                                await whatsappService.sendMessage(botonConfirmar);
                                userState.step = 40;                           
                            }

                        }catch(e){
                            const errorDni = model.modelText(number, utilities.errorDni);
                            await whatsappService.sendMessage(errorDni);
                            userState.step = 1;
                            Sentry.captureException(e);

                        }
                      
                        
                        
                                              
                    } else {

                        const errorDni = model.modelText(number, utilities.errorDni);
                        await whatsappService.sendMessage(errorDni);
                        userState.step = 3;

                    }               

                    break;
                }
    
                case 4: //nombre
                {
                    userState.nombre = text;                                            
                    const apellido = model.modelText(number, utilities.apellido);
                    await whatsappService.sendMessage(apellido);
                    userState.step = 5; 
                    break;
                }
                case 5: //apellido
                {
                    userState.apellido = text;                                            
                    const email = model.modelText(number, utilities.email);
                    await whatsappService.sendMessage(email);
                    userState.step = 6; 
                    break;
                }
                case 6://email
                {
                    if(!whatsappService.isValidEmail(text)){
                        const emailError = model.modelText(number, utilities.errorEmail);
                       await whatsappService.sendMessage(emailError);
                       userState.step = 6; 
                    }else{
                        userState.email = text;      
                        const celular = model.modelText(number, utilities.celular);
                        await whatsappService.sendMessage(celular);
                        userState.step = 7;
                    }
                   
                    break;
                }
                case 7://celular
                {
                    userState.celular = text;
                    if(userState.existe_user){
                        const legajo = model.modelText(number, utilities.legajo);
                        await whatsappService.sendMessage(legajo);   
                        userState.step = 8; 
                    }else{
                        const registro = utilities.getUser(userState)
                        const registro_model = model.modelText(number, registro);
                        await whatsappService.sendMessage(registro_model);
                        const botonConfirmar = model.modelButtonGeneric(number, "Los datos son correctos?", ["SI", "NO"]);        
                        await whatsappService.sendMessage(botonConfirmar);
                        userState.step = 50; 

                    }
                  
                    break;
                } 
                case 8://legajo
                {
                    userState.legajo = text;                                        
                    const dire = model.modelText(number, utilities.direccion);
                    await whatsappService.sendMessage(dire);
                    userState.step = 9; 
                    break;
                }
             
                case 9://direccion
                {
                    userState.direccion = text;  
                    const empresaId = userState.empresa_id;
                    try{     
                       const provincias = await whatsappService.findProvincia(empresaId, userState.token);                    
                       const title = 'Por Favor elija con un número su provincia\n'                    
                       const resultString = provincias.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
                       userState.provincias = provincias;
                       const str_provincias_title = title + resultString;
                       const str_provincias = model.modelText(number, str_provincias_title);
                       await whatsappService.sendMessage(str_provincias);
                       userState.step = 10; 
                    }catch(e){
                       const error = model.modelText(number, utilities.error);
                       await whatsappService.sendMessage(error);
                       userState.step = 1;
                       Sentry.captureException(e);
                       //log error
                    }
                    break;
                }   
                case 10://localidad
                {
                    let isValid = false;
                    if (whatsappService.isNumeric(text)) {
                       const index = (Number.parseInt(text) - 1);
                       if(index >= 0 && index < userState.provincias.length){                        
                        const idProvincia = userState.provincias[index].id;                        
                        
                        try{
                           const localidades = await whatsappService.findLocalidad(idProvincia, userState.token);
                           const title = 'Por Favor elija con un número su localidad\n'                    
                           const resultString = localidades.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
                           userState.localidades = localidades;
                           const str_localidades_title = title + resultString;
                           const str_localidades = model.modelText(number, str_localidades_title);
                           await whatsappService.sendMessage(str_localidades);
                           userState.step = 11; 
                           isValid = true;
                        }catch(e){
                            const error = model.modelText(number, utilities.error);
                            await whatsappService.sendMessage(error);
                            userState.step = 1;
                            Sentry.captureException(e);

                        }
                       }
                   }
                    if (!isValid) {
                        // Handle case where the input text is not numeric or index is out of bounds
                        const provinciaNoEncontrado = model.modelText(number, utilities.errorProvincia);
                        await whatsappService.sendMessage(provinciaNoEncontrado);
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
                        try{
                            const sucursales = await whatsappService.findSucursal(idLocalidad, userState.token);
                            const title = 'Por Favor elija con un número su sucursal\n'                    
                            const resultString = sucursales.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n');
                            userState.sucursales = sucursales;
                            const str_sucursales_title = title + resultString;
                            const str_sucursales = model.modelText(number, str_sucursales_title);
                            await whatsappService.sendMessage(str_sucursales);
                            userState.step = 12;
                            isValid = true;      
                        }catch(e){
                            const error = model.modelText(number, utilities.error);
                            await whatsappService.sendMessage(error);
                            userState.step = 1;
                            Sentry.captureException(e);
                        }  
                        
                       }
                   }
                    if (!isValid) {
                        // Handle case where the input text is not numeric or index is out of bounds
                        const localidadNoEncontrado = model.modelText(number, utilities.errorLocalidad);
                        await whatsappService.sendMessage(localidadNoEncontrado);
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
                        isValid = true;             
                         const botonEleccion = model.modelButtonAusencia(number, utilities.tituloBoton);                           
                        await whatsappService.sendMessage(botonEleccion);
                        userState.step = 13;                            
              
                       }
                   }
                    if (!isValid) {
                        // Handle case where the input text is not numeric or index is out of bounds
                        const sucursalNoEncontrado = model.modelText(number, utilities.errorSucursal);
                        await whatsappService.sendMessage(sucursalNoEncontrado);
                        userState.step = 12;
                    }
                    break;   
                }
                case 13:{
                    if(text === "Enfermedad"){                        
                        userState.causa = text;                  
                        const enfermedad = model.modelText(number, utilities.enfermedad);
                        await whatsappService.sendMessage(enfermedad);
                        userState.step = 14; 
                    }else if(text === "Otros"){
                        const motivo = model.modelText(number, utilities.motivo);
                        await whatsappService.sendMessage(motivo);
                        userState.step = 30; 
                    }
                    else{
                        const ausencia = model.modelText(number, utilities.ausencia);
                        await whatsappService.sendMessage(ausencia);
                        userState.step = 13;                       
                    }                  
                    break;

                }


                case 14://Sintomas
                {
                    userState.enfermedad = text;                                            
                    const enfermedad = model.modelText(number, utilities.sintomas);
                    await whatsappService.sendMessage(enfermedad);
                    userState.step = 15; 
                    break;           
                    
                }
                case 15://Medicacion
                {
                    userState.sintomas = text;                                            
                    const medicacion = model.modelText(number, utilities.medicacion);
                    await whatsappService.sendMessage(medicacion);
                    userState.step = 16; 
                    break;           
                    
                }
                case 16://Recibio Asistencia
                {
                    userState.medicacion = text;     
                    const botonAsistencia = model.modelButtonGeneric(number, "Recibio Asistencia:", ["SI", "NO"]);        
                    await whatsappService.sendMessage(botonAsistencia);
                    userState.step = 17; 
                    break;         
                }
                case 17://Posee certificado
                {
                    userState.asistencia = text;                    
                    const certificado = model.modelText(number, utilities.certificado);
                    await whatsappService.sendMessage(certificado);
                    const botonCertificado = model.modelButtonGeneric(number, "Desea adjuntar Certificado?(Foto)", ["SI", "NO"]);        
                    await whatsappService.sendMessage(botonCertificado);
                    userState.step = 18; 
                    break;   
                }
                case 18://Adjuntar imagen
                {
                    if(text == "SI"){
                        userState.certificado = text;                 
                        const adjuntarImagen = model.modelText(number, utilities.imagen);
                        await whatsappService.sendMessage(adjuntarImagen);
                        userState.step = 19; 
                    }else{
                        userState.certificado = "NO"; 
                        userState.certificado_id = "0";
                        await resumen(userState, number);
                        userState.step = 20;
                    }
                    break;

                    
                }
                case 19://Adjuntar certificado
                {
                    //console.log("id certificado " + text)
                    if (whatsappService.isNumeric(text)) {
                        userState.certificado = "SI";
                        userState.certificado_id = text;
                
                    }else{
                        userState.certificado = "NO"; 
                        userState.certificado_id = "0";
                        
                    }
                    await resumen(userState, number);


                    userState.step = 20;
                    
                       
              
                    break;   
                }
                case 20: //resumen
                {
                    if(text == "SI"){
                        try{
                            const incidencia = utilities.generateIncidencia(userState);
                            const saveUser = await whatsappService.postIncidencia(incidencia, userState.token );
                            const registro = utilities.registro + saveUser; 
                            const registro_model = model.modelText(number, registro); 
                            const saludo_model = model.modelText(number, utilities.saludo);                       
                            await whatsappService.sendMessage(registro_model);
                            await whatsappService.sendMessage(saludo_model);
                           
                        }catch(e){
                              //notificacionFallida
                              const notificacionFallido = utilities.notificacionFallida;
                              const notificacion_model = model.modelText(number, notificacionFallido);
                              await whatsappService.sendMessage(notificacion_model);
                              Sentry.captureException(e);
                          
                        }
                     
                    }else{
                        const saludo = utilities.saludo_vuelta;
                        const saludo_model = model.modelText(number, saludo);                                     
                        await whatsappService.sendMessage(saludo_model);                       
                   
                    }
                    delete usersState[number];
                    userState.step = 1; 
                    break;

                }
                case 22: //guarda
                {

               
                  break;
                }
                case 30: //otros
                {
                    userState.motivo = text;                    
                    const certificado = model.modelText(number, utilities.certificado);
                    await whatsappService.sendMessage(certificado);
                    const botonCertificado = model.modelButtonGeneric(number, "Desea adjuntar Certificado?(Foto)", ["SI", "NO"]);        
                    await whatsappService.sendMessage(botonCertificado);
                    userState.step = 31;                    
                    break;  
                }
                case 31:
                {
                    if(text == "SI"){
                        userState.certificado = text;                 
                        const adjuntarImagen = model.modelText(number, utilities.imagen);
                        await whatsappService.sendMessage(adjuntarImagen);
                        userState.step = 32; 
                    }else{
                        userState.certificado = "NO"; 
                        userState.certificado_id = "0";

                        await resumenNo(userState, number);


                        userState.step = 33;
                    }
                    break;
                }
                case 32://Adjuntar certificado
                {
                    //console.log("id certificado " + text)
                    if (whatsappService.isNumeric(text)) {
                        userState.certificado = "SI";
                        userState.certificado_id = text;
                
                    }else{
                        userState.certificado = "NO"; 
                        userState.certificado_id = "0";
                    }

                    await resumenNo(userState, number);
                    userState.step = 33;
                    break;   
                }

                case 33://Adjuntar certificado
                {
                    //console.log("id certificado " + text)
                    if (text == "SI") {
                        try{
                            const incidencia_no = utilities.generateIncidenciaNo(userState); 
                            const saveUser = await whatsappService.postIncidenciaNo(incidencia_no, userState.token);
                            const registro = utilities.registro + saveUser; 
                            const registro_model = model.modelText(number, registro); 
                            const saludo_model = model.modelText(number, utilities.saludo);                       
                            await whatsappService.sendMessage(registro_model);
                            await whatsappService.sendMessage(saludo_model);                        
                        }catch(e){
                            //notificacionFallida
                            const notificacionFallido = utilities.notificacionFallida;
                            const notificacion_model = model.modelText(number, notificacionFallido);
                            await whatsappService.sendMessage(notificacion_model);
                            Sentry.captureException(e);                           
                        }
                    }else{
                        const saludo = utilities.saludo_vuelta;
                        const saludo_model = model.modelText(number, saludo);                                     
                        await whatsappService.sendMessage(saludo_model);
                    }
               
                    delete usersState[number];
                    userState.step = 1;              
                    break;   
                }

                case 40:{
                    if(text == "SI"){
                        const registrar = utilities.registrarUser;
                        const registrar_model = model.modelText(number, registrar);
                        await whatsappService.sendMessage(registrar_model);
                        const nombre = model.modelText(number, utilities.nombre);
                        await whatsappService.sendMessage(nombre);
                        userState.step = 4;
                    }else{
                        const dni_again = model.modelText(number, utilities.dniMessage);  
                        await whatsappService.sendMessage(dni_again);
                        userState.step = 3;
              
                    }
                    break;
                   
                }

                case 50:{ //verificar registro user
                    if(text == "SI"){
                        const user = utilities.generateUser(userState);
                        //postRegistrar(data, token)
                        try{
                            const registrarUser = await whatsappService.postRegistrar(user, userState.token);
                            userState.user = registrarUser;
                            const registroExitoso = utilities.registroExitoso;
                            const saludo_model = model.modelText(number, registroExitoso);
                            await whatsappService.sendMessage(saludo_model);
                            const legajo = model.modelText(number, utilities.legajo);
                            await whatsappService.sendMessage(legajo);   
                            userState.step = 8;
                        }catch(e){
                            const registroFallido = utilities.registroFallido;
                            const saludo_model = model.modelText(number, registroFallido);
                            await whatsappService.sendMessage(saludo_model);
                            userState.step = 1;
                            Sentry.captureException(e);

                        }
                                                
                  
                        break;
                        
                    }else{
                        const volver = model.modelText(number, utilities.volver);  
                        await whatsappService.sendMessage(volver);
                        delete usersState[number];
                        userState.step = 1;
              
                    }
                    break;

                }


                default:
                {
                        //direccion{}
                    const test1 = model.modelText(number, utilities.test);                    
                    await whatsappService.sendMessage(number, test1);
                    break;

                }
                    
            }

            //console.log(messageValue);
        }

        // myConsole.log(messageValue[0]);
        //console.log(GetTextUser(messageValue[0]))
   
        res.send("EVENT_RECEIVED")
    } catch (e) {

        Sentry.captureException(e);
        res.send("EVENT_RECEIVED")
    }
}



cron.schedule('*/10 * * * *', () => {
    try {
        const currentTime = new Date().getTime();
        const tenMinutes = 10 * 60 * 1000;
        for (const number in usersState) {
          const lastInteractionTime = usersState[number].timestamp;
          const timeDifference = currentTime - lastInteractionTime;
          if (timeDifference > tenMinutes) {
            delete usersState[number];
          }
        }
        console.log('Cleanup completed successfully.');
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error during cleanup:', error);
      }
  });


  async function resumen(userState,number){
    const resumen = utilities.getResumenIncidencia(userState)
    const resumen_model = model.modelText(number, resumen);
    await whatsappService.sendMessage(resumen_model);
    const botonConfirmar = model.modelButtonGeneric(number, "Los datos son correctos?", ["SI", "NO"]);        
    await whatsappService.sendMessage(botonConfirmar);

}

async function resumenNo(userState,number){
    const resumen = utilities.getResumenIncidenciaNo(userState)
    const resumen_model = model.modelText(number, resumen);
    await whatsappService.sendMessage(resumen_model);
    const botonConfirmar = model.modelButtonGeneric(number, "Los datos son correctos?", ["SI", "NO"]);        
    await whatsappService.sendMessage(botonConfirmar);

}


module.exports = {
    verifyToken,
    receiveMessage,
    test
}