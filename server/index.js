const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

class UserManager {
    constructor() {
      this.clients = new Map();
    }

    addUser(username, ws) {
        let response = "success";
        for(const [ws, clientname] of this.clients.entries()) {
            if(nickname === clientname) {
                response = "fail";
            }
        
        }
        if(response === "success") {
            this.clients.set(ws, username);
        }
        return response;
    }

    sendMessage(messageContent, ws) {
        const senderName = this.clients.get(ws)
        for(const [ws, username] of this.clients.entries()) {
            ws.send(JSON.stringify({type: "message", content: `${messageContent}`, sender: `${senderName}`}));
        }
        return 'success'
    }

}

const userManager = new UserManager();

wss.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message)
        console.log(message)
        let result;
        switch(message.type) {
            case 'register':
                result = userManager.addUser(message.content, ws);
                ws.send(JSON.stringify({type: "register", content: result}))
                break;
            case 'message':
                result = userManager.sendMessage(message.content, ws);
                break;
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