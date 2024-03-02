// uncomment this if you want to run this in node,
// also if you want to run this in node then you also
// have to comment HTML functions.
//
// const { WebSocket } = require("ws");
const ws = new WebSocket('ws://localhost:8080');
let nickname = "sillyCat"

ws.addEventListener('open', () => {
  console.log('Connected to WebSocket server.');
  ws.send(JSON.stringify({ type: 'register', content: nickname }));
});

ws.addEventListener('message', message => {
    message = JSON.parse(message.data)
    switch(message.type) {
        case 'register':
            if(message.content === "success") {
                console.log("registered successfully!")
            } else console.log("didnt register!, response: ", message.content)
            break;
        case 'message':
            console.log("message recieved!: ", message.content);
            document.getElementById("messenger").innerHTML += 
            '<div class="msg">' + message.sender + '|' + message.content + '</div>';
            break;
        default:
            console.log("bad message type!, ", message);
            break;
    }   
});

/*
#MESSENGER PART
*/

function sendMessage() {
    let message = document.getElementById("messageSender").value;
    ws.send(JSON.stringify({ type: 'message', content: message, sender: nickname }))    ;
};
