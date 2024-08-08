const carrefour = (req, res, next) => {
    req.empresa = {id:1, empresa:"Carrefour"};
    next();
};




module.exports = {
    carrefour
}