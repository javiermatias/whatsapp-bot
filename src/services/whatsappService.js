const https = require("https");
const axios = require('axios');
require('dotenv').config();

const base_url = 'https://ausentismos.online/api';

async function findByDni(dni, token){
    const url = `${base_url}/whatsapp/${dni}`;
    //console.log(url);
    try {
      const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
       
          return response.data; // Return the data if the status is 200
      
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

async function getCompany(nroTelefono,token) {
  const url = `${base_url}/empresa/empresa-by-number/${nroTelefono}`;
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

  async function sendMessage(data, empresa) {
    const url = `https://graph.facebook.com/v19.0/${empresa.idWhatsapp}/messages`;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${empresa.token}`
    };
    
    try {
        const response = await axios.post(url, data, { headers });
        //console.log(response.data);
    } catch (error) {
        console.error(error);
        Sentry.captureException(error);        
    }
}




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
    postRegistrar,
    getCompany
}