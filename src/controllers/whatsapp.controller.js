const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
const verifyToken = (req, res) => {

    try {
        let accessToken = "ASDA#$@RRDFS#@$DFSVXC234234SDF";
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];

        if (challenge != null && token != null & token == accessToken) {
            myConsole.log("verifico ok");
            res.send(challenge);
        } else {
            myConsole.log("no verifico");
            res.status(400).send();
        }

    } catch (ex) {
        myConsole.log("ocurrio una excepcion");
        res.status(400).send();
    }

}

const receiveMessage = (req, res) => {
    try {
        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];
        let value = changes["value"];
        let messageValue = value["messages"];

        myConsole.log(messageValue);
        console.log(messageValue)

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