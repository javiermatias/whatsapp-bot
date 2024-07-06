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

    const itemsj =  JSON.stringify(items);


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
            "sections": [
                {
                    "title": title,
                    "rows": itemsj
                }
         
            ]
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

module.exports = {
    modelText,
    modelButtonAusencia,
    modelList

}