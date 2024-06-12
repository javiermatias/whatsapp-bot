const verifyToken = (req, res) => {
    res.send("Hola Mundo strange cabrones")
}

const receiveMessage = (req, res) => {
    res.send("Hola received")
}

module.exports = {
    verifyToken,
    receiveMessage
}