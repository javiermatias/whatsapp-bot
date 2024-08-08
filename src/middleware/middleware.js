const carrefour = (req, res, next) => {
    req.empresa = { id:1079, nombre:"Carrefour"};
    next();
};




module.exports = {
    carrefour
}