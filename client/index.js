const { WebSocket } = require("ws");
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to WebSocket server.');

  let username = "sillyCat"
  ws.send(JSON.stringify({ type: 'register', content: username }));
  let message = "its working yippee"
  setTimeout(() => {
    ws.send(JSON.stringify({type: "sendMessage", content: message}))
  }, 500);
});

ws.on('message', message => {
    message = JSON.parse(message)
    console.log(message)
    switch(message.type) {
        case 'register':
            if(message.content === "success") {
                console.log("registered successfully!")
            } else console.log("didnt register!, response: ", message.content)
            break;
        case 'message':
            console.log("message recieved!: ", message.content)
            document.getElementById("msg").innerText = "message recieved!"; 
            break;
        default:
            console.log("bad message type!, ", message)
            break;
    }
});