const commands = {
    'chat-create': {
        args: ['chatName'],
        description: 'Creates new chat /chat-create MYCHAT MYFRIENDS.../'
    },
    'chat-connect': {
        args: ['chatName'],
        description: 'Connects to chat /chat-connect MYCHAT/'
    },
    'chat-addUser': {
        args: ['chatName' ,'username'],
        description: 'Adds user to chat /chat-addUser MYCHAT MYFRIENDS.../'
    },
    'registration': {
        description: 'Create new terminal account and get access to crazy features'
    },
    'login': {
        description: 'Enter to your existing account'
    },
    'help': {
        description: 'List of commands'
    }

};

export default commands