const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

class ClientManager {
    constructor() {
      this.clients = new Map();
    }

    addClient(clientname, ws) {
        let response = "success";
        for(const [username, ws] of this.clients.entries()) {
            if(clientname === username) {
                response = "fail";
            }
        }
        if(response === "success") {
            this.clients.set(clientname, ws);
        }
        return response;
    }

    sendMessage(messageContent) {
        for(const [username, ws] of this.clients.entries()) {
            ws.send(JSON.stringify({type: "message", content: `${messageContent}`, user: `${username}`}));
        }
        return 'success'
    }

}

const clientManager = new ClientManager();

wss.on('connection', ws => {
    
    ws.on('message', message => {
        message = JSON.parse(message)
        console.log(message)
        let result;
        switch(message.type) {
            case 'register':
                result = clientManager.addClient(message.content, ws);
                ws.send(JSON.stringify({type: "register", content: result}))
                break;
            case 'sendMessage':
                result = clientManager.sendMessage(message.content);
                break;
                //for now i'll comment this since its not really useful for anything
                // ws.send(JSON.stringify({type: "sendMessage", content: result}))
            default:
                console.log("bad message type!, ", message)
                break;
        }
    })


    ws.on('close', stream => {
        console.log("websocket client disconnected!")
    })

    ws.on('error', err => {
        console.error(err)
    })
});