const verifyToken = (req, res) => {

    try {
        let accessToken = "ASDA#$@RRDFS#@$DFSVXC234234SDF";
        let token = req.query["hub.verify_token"];
        let challenge = req.body["hub.challenge"];

        if (challenge != null && token != null & token == accessToken) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }

    } catch (ex) {
        res.status(400).send();
    }

}

const receiveMessage = (req, res) => {
    res.send("Hola received")
}

module.exports = {
    verifyToken,
    receiveMessage
}