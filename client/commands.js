const commands = {
    'registration': {
        description: 'Create new terminal account and get access to crazy features'
    },
    'login': {
        description: 'Enter to your existing account'
    },
    'chat-connect': {
        args: ['chatName'],
        description: 'Connects to chat /chat-connect MYCHAT/'
    },
    'chat-disconnect': {
        description: 'Disconnects from chat'
    },
    'chat-create': {
        args: ['chatName'],
        description: 'Creates new chat /chat-create MYCHAT MYFRIENDS.../'
    },
    'chat-addUser': {
        args: ['chatName' ,'username'],
        description: 'Adds user to chat /chat-addUser MYCHAT MYFRIENDS.../'
    },
    'chat-list': {
        description: 'List of chats available to you'
    },
};

export default commands