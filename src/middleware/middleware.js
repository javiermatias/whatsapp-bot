require('dotenv').config();
const companies = [{ id:1079, nombre:"Carrefour", number:"5493543609446"}]

const company = (req, res, next) => {
    try{
        let phone = req.body.entry[0].changes[0].value.metadata.display_phone_number;
        let company = companies.find(x => x.number === phone);        
        if(company) { req.empresa = company;}        
        next();      
    }catch(e){    
        Sentry.captureException(e);
    }

 
};




module.exports = {
    company
}