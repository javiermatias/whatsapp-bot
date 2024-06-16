// messages.js

const greetingMessage = `Bienvenidos a Ausentismos online. Para notificar su ausencia
                         via online puede dirigirse a: https://front-ausentismo.vercel.app/
                         Si quiere notificar la ausencia por este medio indique *OK*`;
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

        } else if (type == "list_reply") {

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
}