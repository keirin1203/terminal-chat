let term = $('body').terminal(function (command) {
    const cmd = $.terminal.parse_command(command)
    console.log(cmd)

    switch (cmd.name) {
        case 'connect':
            socket = io()

            socket.on('messageToClient', (message) => {
                this.echo(message, {raw: true})
            })
            break;

        case 'cats':
            const img = `<img src="https://placekitten.com/${cmd.args[0]}/${cmd.args[1]}">`
            socket.emit('messageToServer', img)
            break;
        default:
            if (!socket) {
                this.echo('Please, connect to server')
                break
            }

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