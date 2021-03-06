import Chat from "./chat.js"
import Auth from "./auth.js"
import commands from "./commands.js"

let term = $('body').terminal(async function (command) {
        const cmd = $.terminal.parse_command(command)

        switch (cmd.name.toLowerCase()) {
            case 'registration':
                auth.registration()
                break;
            case 'login':
                auth.login()
                break;
            case 'chat-create':
                await chat.createChat(cmd.args.shift(), cmd.args)
                break;
            case 'chat-addUser':
                await chat.addUsers(cmd.args.shift(), cmd.args)
                break;
            case 'chat-connect':
                chat.connectToChat(cmd.args[0])
                
                chat.socket.on('messageToClient', (message) => {
                    this.echo(message, {raw: true})
                })
                break;
            case 'chat-disconnect':
                chat.disconnect()
                this.echo('Disconnected...')
                break;
            case 'chat-list':
                await chat.getUserChats()
                break;
            case 'userlist':
                await chat.getAllUsers()
                break;
            case 'help':
                Object.keys(commands).forEach(key => {
                    this.echo(`[[;yellow;]${key.padEnd(20)}[[;gray;]${commands[key].description}`)
                });
                break;

            default:
                if (!chat.getSocket()) {
                    this.echo('Please, connect to chat')
                    break
                }

                const message = cmd.name + " " + cmd.rest

                chat.sendMessage(message)
                break;
        }
    },

    {
        greetings: greetings.innerHTML,
        autocompleteMenu: true,
        completion: function () {
            const term = this;

            return new Promise(function (resolve) {
                const command = term.get_command();
                const name = command.match(/^([^\s]*)/)[0];
                let list = [];
                if (name) {
                    const word = term.before_cursor(true);
                    const regex = new RegExp('^' + $.terminal.escape_regex(word));
                    if (name == word) {
                        list = Object.keys(commands);
                    } else if (command.match(/\s/)) {
                        if (commands[name]) {
                            if (word.match(/^--/)) {
                                list = commands[name].options.map(function (option) {
                                    return '--' + option;
                                });

                            } else {
                                list = commands[name].args;
                            }
                        }
                    }
                }
                resolve(list);
            });
        }
    });

async function onStart(terminal) {
    let response = await fetch('/users/checkByToken', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    if (response.ok) {
        let username = await response.text();
        terminal.set_prompt(`${username}@you: `)
    } else {
        terminal.set_prompt(`guest@you: `)
    }
}

onStart(term)

var empty = {
    options: [],
    args: []
};

let chat = new Chat(term)
let auth = new Auth(term)
