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

function modelList(number, header, body, footer) {
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
        "footer": {
            "text": footer
        },
        "action": {
            "button": "<BUTTON_TEXT>",
            "sections": [
                {
                    "title": "<LIST_SECTION_1_TITLE>",
                    "rows": [
                        {
                            "id": "<LIST_SECTION_1_ROW_1_ID>",
                            "title": "<SECTION_1_ROW_1_TITLE>",
                            "description": "<SECTION_1_ROW_1_DESC>"
                        },
                        {
                            "id": "<LIST_SECTION_1_ROW_2_ID>",
                            "title": "<SECTION_1_ROW_2_TITLE>",
                            "description": "<SECTION_1_ROW_2_DESC>"
                        }
                    ]
                },
                {
                    "title": "<LIST_SECTION_2_TITLE>",
                    "rows": [
                        {
                            "id": "<LIST_SECTION_2_ROW_1_ID>",
                            "title": "<SECTION_2_ROW_1_TITLE>",
                            "description": "<SECTION_2_ROW_1_DESC>"
                        },
                        {
                            "id": "<LIST_SECTION_2_ROW_2_ID>",
                            "title": "<SECTION_2_ROW_2_TITLE>",
                            "description": "<SECTION_2_ROW_2_DESC>"
                        }
                    ]
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