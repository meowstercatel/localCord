// uncomment this if you want to run this in node,
// also if you want to run this in node then
// have to comment HTML functions.
//
// const { WebSocket } = require("ws");
let ws;
let username = "sillyCat"

function startWebsocketConnection() {
    ws = new WebSocket('ws://localhost:8080');

    ws.addEventListener('open', () => {
        console.log('Connected to WebSocket server.');
        ws.send({ type: 'register', content: username });
    });

    ws.addEventListener('message', message => {
        switch (message.type) {
            case 'register':
                if (message.content === "success") {
                    console.log("registered successfully!")
                } else console.log("didnt register!, response: ", message.content)
                break;
            case 'message':
                console.log("message recieved!: ", message.content);
                document.getElementById("messenger").innerHTML +=
                `<div class="msg"><span class="username">${message.author}</span><span class="msg-content">${message.content}</span></div>`;
                break;
            default:
                console.log("bad message type!, ", message);
                break;
        }
    });
}

try {
    startWebsocketConnection()
} catch(e) {
    console.log("ERR: ", e)
    setTimeout(() => {
        startWebsocketConnection()
    }, 5000);
}

/*
#MESSENGER PART
*/

function sendMessage() {
    let message = document.getElementById("messageSender").value;
    ws.send({ type: 'message', content: message });
};
