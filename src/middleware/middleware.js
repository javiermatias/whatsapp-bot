const carrefour = (req, res, next) => {
    let phone = req.body.entry[0].changes[0].value.metadata.display_phone_number;
    console.log(phone);
    req.empresa = { id:1079, nombre:"Carrefour"};
    next();
};




module.exports = {
    carrefour
}