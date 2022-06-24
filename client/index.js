import Chat from "./chat.js"
import Auth from "./auth.js"

const commands = {
    'registration': {
        description: 'Create new terminal account and get access to crazy features'
    },
    'login': {
        description: 'Enter to your existing account'
    }
};

var empty = {
    options: [],
    args: []
};
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
            case 'help':
                Object.keys(commands).forEach(key => {
                    this.echo(`[[;yellow;]${key.padEnd(15)}[[;gray;]${commands[key].description}`)
                    console.log(key, commands[key]);
                });
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
        autocompleteMenu: true,
        //clear: false, // will disable command and completion for defaul commands
        //exit: false,
        completion: function () {
            const term = this;
            // return promise if completion need to be asynnc
            // in this example it's not needed, you can just retrun an array
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

let chat
let auth = new Auth(term)
