// messages.js

const greetingMessage = "Bienvenidos a Ausentismos online. Para notificar su ausencia via online puede dirigirse a: https://front-ausentismo.vercel.app/ Si quiere notificar la ausencia por este medio indique *OK*";
const dniMessage = "Por favor indique numero de *DNI*:";
const errorDni = "Disculpa! El DNI que indicaste tiene un error. ";
const dniAceptado = "Gracias por indicar tu dni";

const farewellMessage = "Goodbye! Have a great day!";
const helpMessage = "Here are some things you can ask me to do...";
const errorMessage = "Oops! Something went wrong. Please try again.";


function GetTextUser(messages) {
    let text = "";
    let typeMessage = messages["type"];
    if (typeMessage == "text") {
        text = (messages["text"])["body"]

    } else if (typeMessage == "interactive") {
        let interactiveObject = messages["interactive"];
        let type = interactiveObject["type"];

        if (type == "button_reply") {
            text = (interactiveObject["button_reply"])["title"]

        } else if (type == "list_reply") {
            text = (interactiveObject["list_reply"])["title"]
        } else {
            console.log("sin mensaje")
        }
    } else {
        console.log("sin mensaje")
    }

    return text;
}

module.exports = {
    GetTextUser,
    greetingMessage,
    farewellMessage,
    helpMessage,
    errorMessage,
    dniMessage,
    errorDni,
    dniAceptado
}