import Chat from "./chat.js"

let term = $('body').terminal(async function (command) {
        const cmd = $.terminal.parse_command(command)
        console.log(cmd)

        switch (cmd.name) {
            case 'registration':
                this.read('username: ', async username => {
                    let response = await fetch('/users/check' + '?' + `username=${username}`);
                    let json
                    if (response.ok) {
                        json = await response.json();
                    } else {
                        this.echo(response.statusMessage)
                        return
                    }

                    if (json["status"] === "false") {
                        this.echo(`This username is free`)
                    } else {
                        this.echo(`User ${username} already exists`)
                        return
                    }

                    this.read('password: ', async password => {
                        const userData = {
                            username: username,
                            password: password
                        }

                        let response = await fetch('/auth/registration', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userData),
                        });
                        let token
                        if (response.ok) {
                            token = await response.text();
                        } else {
                            this.echo(response.statusMessage)
                            return
                        }

                        localStorage.setItem('token', token)
                    })

                })

                break;
            case 'login':
                const name = cmd.args[0]
                let response = await fetch('/users/check' + '?' + `username=${name}`);

                if (response.ok) {
                    let json = await response.json();

                } else {

                }


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