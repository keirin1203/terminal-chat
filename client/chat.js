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

    disconnect(){
        this.socket.disconnect()
        this.socket = ''
    }

    getSocket() {
        return this.socket
    }

    sendMessage(message){
        this.socket.emit('messageToServer', message)
    }

    async getUserChats(){
        let response = await fetch('/users/getUserChats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (response.ok) {
            let chats = await response.json();
            for (const chat of chats) {
                this.terminal.echo(`[[;green;]${chat.name.padEnd(20)}`)
            }
            console.log(json)
        } else {
            let json = await response.json();
            this.terminal.echo(json.message)
            return
        }
    }

    async getAllUsers(){
        let response = await fetch('/users/getUserList', {
            method: 'GET',
        });
        if (response.ok) {
            let result = await response.json();

            const tab = 'Username'
            this.terminal.echo(`All users: ${result.countAll}`)
            this.terminal.echo(`${tab.padEnd(20)}Registration date`)

            for (const user of result.users) {
                this.terminal.echo(`[[;green;]${user.username.padEnd(20)}[[;gray;]${user.created_at}`)
            }
        } else {
            let json = await response.json();
            this.terminal.echo(json.message)
            return
        }
    }
}

export default Chat