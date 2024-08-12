const https = require("https");
const axios = require('axios');
require('dotenv').config();

const base_url = 'https://ausentismos.online/api';
//const base_url = 'http://localhost:3001/api';

async function findByDni(dni, token){
    const url = `${base_url}/whatsapp/${dni}`;
    //console.log(url);
    try {
      const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      return response.data; // Return the data if the request is successful
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.status);
        return {}
        //throw new Error(`Error from API: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        return {}
        //throw new Error('No response received from the API.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        return {}
        //throw new Error('An error occurred while making the request.');
      }
    }
}

async function findProvincia(idEmpresa,token) {
  const url = `${base_url}/whatsapp/provincias?empresa=${idEmpresa}`;
  //console.log(url);
  try {
    const response = await axios.get(url,{
      headers: {
          Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Return the data if the request is successful
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.status);
      return [];
      //throw new Error(`Error from API: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
     // throw new Error('No response received from the API.');
     return [];
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      //throw new Error('An error occurred while making the request.');
      return [];
    }
  }
}

async function findLocalidad(idProvincia,token) {
  const url = `${base_url}/whatsapp/localidades?provincia=${idProvincia}`;
  //console.log(url);
  try {
    const response = await axios.get(url,{
      headers: {
          Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Return the data if the request is successful
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.status);
      return [];
      //throw new Error(`Error from API: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
     // throw new Error('No response received from the API.');
     return [];
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      //throw new Error('An error occurred while making the request.');
      return [];
    }
  }
}

async function findSucursal(idLocalidad,token) {
  const url = `${base_url}/whatsapp/sucursales?localidad=${idLocalidad}`;
  //console.log(url);
  try {
    const response = await axios.get(url,{
      headers: {
          Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Return the data if the request is successful
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.status);
      return [];
      //throw new Error(`Error from API: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
     // throw new Error('No response received from the API.');
     return [];
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      //throw new Error('An error occurred while making the request.');
      return [];
    }
  }
}

async function postIncidencia(data,token) {
   
  const url = `${base_url}/whatsapp/incidencia`;
  try {
    const response = await axios.post(url, data,{
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
    return response.data; // Return the data if the request is successful
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.status);
      return [];
      // throw new Error(`Error from API: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      // throw new Error('No response received from the API.');
      return [];
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      // throw new Error('An error occurred while making the request.');
      return [];
    }
  }
}

async function postIncidenciaNo(data, token) {
   
    const url = `${base_url}/whatsapp/incidenciano`;
    try {
      const response = await axios.post(url, data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      return response.data; // Return the data if the request is successful
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.status);
        return [];
        // throw new Error(`Error from API: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        // throw new Error('No response received from the API.');
        return [];
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        // throw new Error('An error occurred while making the request.');
        return [];
      }
    }
  }

  async function postRegistrar(data, token) {
   
    const url = `${base_url}/users`;
    try {
      const response = await axios.post(url, data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      return response.data; // Return the data if the request is successful
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.status);
        return [];
        // throw new Error(`Error from API: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        // throw new Error('No response received from the API.');
        return [];
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        // throw new Error('An error occurred while making the request.');
        return [];
      }
    }
  }

  async function sendMessage(data) {
    const url = 'https://graph.facebook.com/v19.0/250745364796553/messages';
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer EAAOYsaSAfZBYBOygJffraK4UnliD3swW9Goy8NSJ1JrqE69UJRTVqSnvi4U4ZClvy3SGgW2SrOTMEmLmShMY2xzyE4VQ1fRXQdDb7bAlti3VHbJo9SYgvuQyrfOQjDV8r0SwRLJPpZCtaMlLX7LAJxnCsBsJgwUNaS5o6TDSFcJATKFx53hYk0Ax3ZCn1Lwa"
    };

    try {
        const response = await axios.post(url, data, { headers });
        //console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
async function loginToAusentismosOnline(username, password) {
  try {
      const response = await axios.post(`${base_url}/auth/login`, {
          username: username,
          password: password
      });

      // Handle the response as needed
      //console.log('Login successful:', response.data);
      return response.data;
  } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      throw error;
  }
}

/* function sendMessage(data) {

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

} */

// Function to check if the text is numeric
function isNumeric(text) {
    return /^\d+$/.test(text);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


module.exports = {
    sendMessage,
    isNumeric,
    findByDni,
    findProvincia,
    findLocalidad,
    findSucursal,
    postIncidencia,
    postIncidenciaNo,
    isValidEmail,
    loginToAusentismosOnline,
    postRegistrar
}