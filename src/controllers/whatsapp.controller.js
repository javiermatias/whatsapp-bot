const fs = require('fs');
require('dotenv').config();
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
const whatsappService = require("../services/whatsappService");
const utilities = require("../shared/utilities");
const usersState = {}; // Aquí almacenamos el estado de cada usuario
const model = require("../shared/models");

const verifyToken = (req, res) => {

    try {
        let accessToken = process.env.accessToken;
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];

        if (challenge != null && token != null & token == accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }

    } catch (ex) {
        /* console.log("ocurrio una excepcion");
        myConsole.log("ocurrio una excepcion"); */
        res.status(400).send();
    }

}

const receiveMessage = (req, res) => {
    try {
        myConsole.log(req);

        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];
        let value = changes["value"];
        let messages = value["messages"];


        if (typeof messages != "undefined") {
            let messageValue = messages[0];
            let number = messageValue["from"];
            let text = utilities.GetTextUser(messageValue);

            if (!usersState[number]) {
                usersState[number] = { step: 1 };
            }

            const userState = usersState[number];
            console.log("numero: " + number + " estado: " + userState);
            //console.log(userState);
            switch (userState.step) {
                case 1:
                    let modelGreeting = model.modelText(number, utilities.greetingMessage);
                    whatsappService.sendMessage(modelGreeting);
                    userState.step = 2;
                    break;
                case 2:
                    //userState.name = text;
                    let modelOpcion = model.modelButtonAusencia(number, "Que tipo de ausencia quieres notificar?")
                    whatsappService.sendMessage(modelOpcion);
                    userState.step = 3;
                    break;
                case 3:
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
    receiveMessage
}