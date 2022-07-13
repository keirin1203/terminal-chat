export default class Auth {
    constructor(terminal) {
        this.terminal = terminal
    }

    registration() {
        this.terminal.read('username: ', async username => {
            const status = await this.checkUser(username)

            console.log(status)
            if (status === false) {
                this.terminal.echo(`[[;green;]This username is free`)
            } else {
                this.terminal.echo(`[[;red;]User ${username} already exists`)
                return
            }

            this.terminal.read('password: ', async password => {
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
                    this.terminal.echo(`[[;green;]Hello ${username}!`)
                } else {
                    this.terminal.echo(response.statusMessage)
                    return
                }

                this.terminal.set_prompt(`${username}@you: `)
                localStorage.setItem('token', token)
            })
        })
    }

    login() {
        this.terminal.read('username: ', async username => {
            const status = await this.checkUser(username)

            console.log(status)
            if (status === false) {
                this.terminal.echo(`[[;red;]There is no user with this name`)
                return
            }

            this.terminal.read('password: ', async password => {
                const userData = {
                    username: username,
                    password: password
                }

                let response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData),
                });
                let token
                if (response.ok) {
                    token = await response.text();
                    this.terminal.echo(`Hello ${username}!`)
                } else {
                    this.terminal.echo(response.statusMessage)
                    return
                }

                this.terminal.set_prompt(`${username}@you: `)
                localStorage.setItem('token', token)
            })
        })
    }

    async checkUser(username) {
        let response = await fetch('/users/check' + '?' + `username=${username}`);
        let json
        if (response.ok) {
            json = await response.json();
        } else {
            this.terminal.echo(response.statusMessage)
            return
        }

        console.log(json["status"])
        if (json["status"] === "true") {
            return true
        } else {
            return false
        }
    }
}