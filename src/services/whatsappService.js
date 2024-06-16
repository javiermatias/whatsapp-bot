const https = require("https");


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


module.exports = {
    sendMessage
}