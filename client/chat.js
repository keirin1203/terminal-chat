class Chat {
    constructor(terminal, username) {
        this.terminal = terminal
        this.username = username

        this.socket = ''
    }

    async createChat(chatname, users){
        let response = await fetch('/chats/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: chatname,
                users: users,
            }),
        });
        if (response.ok) {
            let json = await response.json();
            this.terminal.echo(`Chat ${chatname} created!`)
            console.log(json)
        } else {
            let json = await response.json();
            this.terminal.echo(json.message)
            return
        }
    }

    async addUsers(chatName, users){
        let response = await fetch('/chats/addUsersToChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: chatName,
                users: users,
            }),
        });
        if (response.ok) {
            let json = await response.json();
            this.terminal.echo(`User added`)
            console.log(json)
        } else {
            let json = await response.json();
            this.terminal.echo(json.message)
            return
        }
    }

    connectToChat(chatname){
        this.socket = io({
            auth: {
                token: `Bearer ${localStorage.getItem('token')}`
            },
            query: {
                chatname: chatname
            }
        })
    }

    sendMessage(message){
        this.socket.emit('messageToServer', message)
    }

}

export default Chat