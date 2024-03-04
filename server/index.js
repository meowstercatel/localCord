const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

class UserManager {
    constructor() {
      this.clients = new Map();
    }

    addUser(clientname, ws) {
        let response = "success";
        for(const [ws, username] of this.clients.entries()) {
            if(clientname === username) {
                response = "fail";
            }
        
        }
        if(response === "success") {
            this.clients.set(ws, username);
        }
        return response;
    }

    removeUser(ws) {
        this.clients.delete(ws)
    }

    sendMessage(messageContent, ws) {
        const senderName = this.clients.get(ws)
        for(const [ws, username] of this.clients.entries()) {
            ws.send(JSON.stringify({type: "message", content: `${messageContent}`, sender: `${senderName}`}));
        }
        return 'success'
    }

    getUsers() {
        let userArr = [];
        for(const [ws, username] of this.clients.entries()) {
            userArr.push(username)
        }
        return userArr
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
            case 'users':
                result = userManager.getUsers()
                ws.send(JSON.stringify({type: "users", content: result}))
                break;
            default:
                console.log("bad message type!, ", message)
                break; 
        }
    })


    ws.on('close', stream => {
        userManager.removeUser(ws);
        console.log("websocket client disconnected!")
    })

    ws.on('error', err => {
        console.error(err)
    })
});