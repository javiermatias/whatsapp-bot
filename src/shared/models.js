function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

function modelText(number, text) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "body": text
        }
    })

    return data;
}

function modelList(number, header, body, footer, title, rows) {

    const items = rows.map(item => ({
        id: item.id.toString(),
        title: item.nombre,
        description: item.nombre
      }))

      const chunks = chunkArray(items, 8);

      const sections = chunks.map((chunk, index) => ({
        title: `${title} ${index + 1}`,
        rows: chunk
      }));


    const sectionsj =  JSON.stringify(sections);
    //console.log(sectionsj);

    const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": number,
    "type": "interactive",
    "interactive": {
        "type": "list",
        "header": {
            "type": "text",
            "text": header
        },
        "body": {
            "text": body
        },      
        "action": {
            "button": footer,
            "sections": sectionsj
        }
    }
    })

    return data;
}

function modelButtonAusencia(number, text) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": text
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "001",
                            "title": "Enfermedad"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "002",
                            "title": "Otros"
                        }
                    }
                ]
            }
        }
    })

    return data;
}

function modelButtonGeneric(number, text, options) {
    const buttons = options.map((option, index) => ({
        "type": "reply",
        "reply": {
            "id": String(index + 1).padStart(3, '0'), // Creates IDs like "001", "002", etc.
            "title": option
        }
    }));
    //const buttonsj =  JSON.stringify(buttons);

    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": text
            },
            "action": {
                "buttons": buttons
            }
        }
    });

    return data;
}


module.exports = {
    modelText,
    modelButtonAusencia,
    modelList,
    modelButtonGeneric

}