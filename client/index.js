import Chat from "./chat.js"
import Auth from "./auth.js"

let term = $('body').terminal(async function (command) {
        const cmd = $.terminal.parse_command(command)
        console.log(cmd)

        switch (cmd.name) {
            case 'registration':
                auth.registration()
                break;
            case 'login':
                auth.login()
                break;
            case 'connect':
                const username = localStorage.getItem('username')
                if (!username) {
                    this.echo('Please, tell me your name...')
                    break;
                }

                chat = new Chat(term, username)
                chat.connectToChat()

                chat.socket.on('messageToClient', (message) => {
                    this.echo(message, {raw: true})
                })
                break;

            default:
                if (!chat) {
                    this.echo('Please, connect to server')
                    break
                }

                const message = cmd.name + " " + cmd.rest

                chat.sendMessage(message)
                break;
        }
    },

    {
        greetings: greetings.innerHTML,
    });

let chat
let auth = new Auth(term)