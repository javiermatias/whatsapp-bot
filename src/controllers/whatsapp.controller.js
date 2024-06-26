const fs = require('fs');
require('dotenv').config();
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
const whatsappService = require("../services/whatsappService");
const utilities = require("../shared/utilities");
const usersState = {}; // Aquí almacenamos el estado de cada usuario
const model = require("../shared/models");

const test = (req, res) => {
    const user =whatsappService.findByDni("32972085");

    res.send("hola")
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
        //myConsole.log(req);

        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];
        let value = changes["value"];
        let messages = value["messages"];
        const dni = 32972080;


        if (typeof messages != "undefined") {
            const messageValue = messages[0];
            const number = messageValue["from"];
            const text = utilities.GetTextUser(messageValue);
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
                case 1:
                    const modelGreeting = model.modelText(number, utilities.greetingMessage);
                    whatsappService.sendMessage(modelGreeting);
                    userState.step = 2;
                    break;
                // Por favor indique numero de DNI
                case 2:
                    const modelDni = model.modelText(number, utilities.dniMessage);
                    whatsappService.sendMessage(modelDni);
                    userState.step = 3;
                    break;
                case 3:
                    //userState.name = text;
                    //here i have to see if dni is a number or not if tis not a number
                    // i have to send a message to repeat 
                    //const dni = Number.parseInt(text)
                    // Check if the conversion resulted in a valid number
                    if (whatsappService.isNumeric(text)) {
                        //Traer el dni del usuario
                        const user = await whatsappService.findByDni(text)                    
                        console.log(user);
                        userState.dni = dni;
                        let dniAceptado = model.modelText(number, utilities.dniAceptado);
                        whatsappService.sendMessage(dniAceptado);
                        userState.step = 3;
                    } else {

                        let errorDni = model.modelText(number, utilities.errorDni);
                        let modelDni = model.modelText(number, utilities.dniMessage);
                        whatsappService.sendMessage(errorDni);
                        whatsappService.sendMessage(modelDni);
                        userState.step = 3;

                    }

                    //let modelOpcion = model.modelButtonAusencia(number, "Que tipo de ausencia quieres notificar?")
                    //whatsappService.sendMessage(modelOpcion);

                    break;
                case 4:
                    //userState.age = text;
                    whatsappService.sendMessage(number, `Perfecto ${userState.name}, de ${userState.age} años. ¡Hemos terminado!`);
                    userState.step = 1; // Reiniciamos el flujo
                    break;
                default:
                    whatsappService.sendMessage(number, 'Algo salió mal, vamos a empezar de nuevo. ¿Cuál es tu nombre?');
                    userState.step = 1;
                    break;
            }

            console.log(messageValue);
        }

        // myConsole.log(messageValue[0]);
        //console.log(GetTextUser(messageValue[0]))

        res.send("EVENT_RECEIVED")
    } catch (ex) {

        myConsole.log(ex);
        res.send("EVENT_RECEIVED")
    }
}



module.exports = {
    verifyToken,
    receiveMessage,
    test
}