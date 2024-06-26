const https = require("https");
const axios = require('axios');
require('dotenv').config();

const base_url = 'https://ausentismos.online/api/';
async function findByDni(dni){
    const url = `${base_url}/whatsapp/${dni}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      return response.data; // Return the data if the request is successful
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.status);
        throw new Error(`Error from API: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        throw new Error('No response received from the API.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        throw new Error('An error occurred while making the request.');
      }
    }


}
function sendMessage(data) {

    const options = {
        host: "graph.facebook.com",
        path: "/v19.0/250745364796553/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer EAAOYsaSAfZBYBOygJffraK4UnliD3swW9Goy8NSJ1JrqE69UJRTVqSnvi4U4ZClvy3SGgW2SrOTMEmLmShMY2xzyE4VQ1fRXQdDb7bAlti3VHbJo9SYgvuQyrfOQjDV8r0SwRLJPpZCtaMlLX7LAJxnCsBsJgwUNaS5o6TDSFcJATKFx53hYk0Ax3ZCn1Lwa"
        }
    }

    const req = https.request(options, res => {
        res.on("data", d => { process.stdout.write(d) });
    })

    req.on("error", error => { console.error(error) })

    req.write(data);
    req.end();

}

// Function to check if the text is numeric
function isNumeric(text) {
    return /^\d+$/.test(text);
}


module.exports = {
    sendMessage,
    isNumeric,
    findByDni
}