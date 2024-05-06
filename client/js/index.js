// uncomment this if you want to run this in node,
// also if you want to run this in node then
// have to comment HTML functions.
//
// const { WebSocket } = require("ws");
let ws;
let username = window.sessionStorage.getItem('username');
let ip = window.sessionStorage.getItem('ip');

function startWebsocketConnection() {
    ws = new WebSocket(`ws://${ip}:17684`);

    ws.addEventListener('open', () => {
        console.log('Connected to WebSocket server.');
        ws.send(JSON.stringify({ type: 'register', content: username }));
    });

    ws.addEventListener('message', message => {
        message = JSON.parse(message.data)
        switch (message.type) {
            case 'register':
                if (message.content === "success") {
                    console.log("registered successfully!")
                } else console.log("didnt register!, response: ", message.content)
                break;
            case 'message':
                console.log("message recieved!: ", message.content);
                document.getElementById("messages").innerHTML +=
                `<div class="box is-flex is-flex-direction-column"><span class="username"><strong>${message.author}</strong></span><span class="message-content ml-1 mt-1">${message.content}</span></div>`;
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
    let message = document.getElementById("messageSend").value;
    ws.send(JSON.stringify({ type: 'message', content: message }));
};
