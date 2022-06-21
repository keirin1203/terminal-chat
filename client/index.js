let term = $('body').terminal(function (command) {
    const cmd = $.terminal.parse_command(command)
    console.log(cmd)

    switch (cmd.name) {
        case 'login':
            const name = cmd.args[0]
            localStorage.setItem('username', name)
            this.echo(`hello ${name}`)
            break;
        case 'connect':
            const username = localStorage.getItem('username')
            if (!username) {
                this.echo('Please, tell me your name...')
                break;
            }

            socket = io({
                query: {
                    username: username
                }
            })

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