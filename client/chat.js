class Chat {
    constructor(terminal, username) {
        this.terminal = terminal
        this.username = username

        this.socket = ''
    }


    connectToChat(){
        this.socket = io({
            query: {
                username: this.username
            }
        })
    }

    sendMessage(message){
        this.socket.emit('messageToServer', message)
    }

}

export default Chat