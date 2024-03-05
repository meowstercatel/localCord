const WebSocket = require('ws');
const fs = require('fs');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');

db.run("CREATE TABLE messages (content varchar(500), author varchar(60), timestamp int(11))")

const wss = new WebSocket.Server({ port: 8080 });

function unixTimestamp() {
    return Math.floor(Date.now() / 1000)
}

class UserManager {
    constructor() {
        this.clients = new Map();
    }

    addUser(clientname, ws) {
        let response = "success";
        for (const [ws, username] of this.clients.entries()) {
            if (clientname === username) {
                response = "fail";
            }

        }
        if (response === "success") {
            this.clients.set(ws, clientname);
        }
        return response;
    }

    removeUser(ws) {
        this.clients.delete(ws)
    }

    sendMessage(messageContent, ws) {
        const senderName = this.clients.get(ws)
        db.run(`INSERT INTO messages(message, author, timestamp) VALUES(?, ?, ?)`, [messageContent, senderName, null],
            function (error) {
                console.log("added message");
            }
        );
        for (const [ws, username] of this.clients.entries()) {
            ws.send(JSON.stringify({ type: "message", content: `${messageContent}`, author: `${senderName}` }));
        }
        return 'success'
    }

    getUsers() {
        let userArr = [];
        for (const [ws, username] of this.clients.entries()) {
            userArr.push(username)
        }
        return userArr
    }

    getMessages() {
        let messageArr = [];
        db.each("SELECT * FROM messages",
            (error, row) => {
                console.log("ROW", row)
                messageArr.push({type: "message", content: row.content, author: row.author})
            }
        );
    }

}

const userManager = new UserManager();

wss.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message)
        console.log(message)
        let result;
        switch (message.type) {
            case 'register':
                result = userManager.addUser(message.content, ws);
                ws.send(JSON.stringify({ type: "register", content: result }))
                break;
            case 'message':
                result = userManager.sendMessage(message.content, ws);
                break;
            case 'users':
                result = userManager.getUsers()
                ws.send(JSON.stringify({ type: "users", content: result }))
                break;
            case 'getMessages':
                result = userManager.getMessages()
                ws.send(JSON.stringify({type: "messages", content: result }))
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