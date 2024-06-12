const verifyToken = (req, res) => {
    res.send("Hola Mundo strange hijos de mil")
}

const receiveMessage = (req, res) => {
    res.send("Hola received")
}

module.exports = {
    verifyToken,
    receiveMessage
}