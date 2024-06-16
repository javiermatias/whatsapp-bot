const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
const whatsappService = require("../services/whatsappService")

const usersState = {}; // Aquí almacenamos el estado de cada usuario

const verifyToken = (req, res) => {

    try {
        let accessToken = "ASDA#$@RRDFS#@$DFSVXC234234SDF";
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];

        if (challenge != null && token != null & token == accessToken) {
            console.log("verifico ok");
            myConsole.log("verifico ok");
            res.send(challenge);
        } else {
            console.log("no verifico");
            myConsole.log("no verifico");
            res.status(400).send();
        }

    } catch (ex) {
        console.log("ocurrio una excepcion");
        myConsole.log("ocurrio una excepcion");
        res.status(400).send();
    }

}

const receiveMessage = (req, res) => {
    try {
        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];
        let value = changes["value"];
        let messages = value["messages"];


        if (typeof messages != "undefined") {
            let messageValue = messages[0];
            let number = messageValue["from"];
            let text = GetTextUser(messageValue)

            if (!usersState[number]) {
                usersState[number] = { step: 1 };
            }

            const userState = usersState[number];
            console.log("numero: " + number + " estado: " + userState);
            //console.log(userState);
            switch (userState.step) {
                case 1:
                    whatsappService.sendMessage(number, 'Bienvenido! ¿Cuál es tu nombre?');
                    userState.step = 2;
                    break;
                case 2:
                    userState.name = text;
                    whatsappService.sendMessage(number, `Gracias ${userState.name}. ¿Cuál es tu edad?`);
                    userState.step = 3;
                    break;
                case 3:
                    userState.age = text;
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

function GetTextUser(messages) {
    let text = "";
    let typeMessage = messages["type"];
    if (typeMessage == "text") {
        text = (messages["text"])["body"]

    } else if (typeMessage == "interactive") {
        let interactiveObject = messages["interactive"];
        let type = interactiveObject["type"];
        if (type == "button_reply") {

        } else if (type == "list_reply") {

        } else {
            console.log("sin mensaje")
        }
    } else {
        console.log("sin mensaje")
    }

    return text;
}

module.exports = {
    verifyToken,
    receiveMessage
}