// uncomment this if you want to run this in node,
// also if you want to run this in node then you also
// have to comment HTML functions.
//
// const { WebSocket } = require("ws");
const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', () => {
  console.log('Connected to WebSocket server.');
  let username = "sillyCat"
  ws.send(JSON.stringify({ type: 'register', content: username }));
  let message = "its working yippee"
  setTimeout(() => {
    ws.send(JSON.stringify({type: "sendMessage", content: message, user: username}))
  }, 500);
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
            document.getElementsByClassName("msg")[0].innerHTML += 
            '<div id="msg">' + message.user + '|' + message.content + '</div>';
            break;
        default:
            console.log("bad message type!, ", message);
            break;
    }   
});