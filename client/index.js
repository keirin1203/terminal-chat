let term = $('body').terminal(function (command) {
    const cmd = $.terminal.parse_command(command)
    switch (cmd.name) {
        case 'connect':
            socket = io()

            socket.on('messageToClient', (message) => {
                this.echo(message)
            })
            break;
        default:
            if (!socket) {
                this.echo('Please, connect to server')
                break
            }
            console.log(cmd)
            const message = cmd.name+ " " + cmd.rest
            socket.emit('messageToServer', message)
            break;
    }
    },
    {
        greetings: greetings.innerHTML,
        completion: true
    });

let socket