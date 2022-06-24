var ul;
var empty = {
    options: [],
    args: []
};
var commands = {
    'get-command': {
        options: ['name', 'age', 'description', 'address'],
        args: ['clear']
    },
    'git': {
        args: ['commit', 'push', 'pull'],
        options: ['amend', 'hard', 'version', 'help']
    },
    'get-name': empty,
    'get-age': empty,
    'get-money': empty,
    'cd': empty,
    'ls': empty
};

var term = $('body').terminal($.noop, {
    autocompleteMenu: true,
    //clear: false, // will disable command and completion for defaul commands
    //exit: false,
    completion: function() {
        var term = this;
        // return promise if completion need to be asynnc
        // in this example it's not needed, you can just retrun an array
        return new Promise(function(resolve) {
            var command = term.get_command();
            var name = command.match(/^([^\s]*)/)[0];
            var list = [];
            if (name) {
                var word = term.before_cursor(true);
                var regex = new RegExp('^' + $.terminal.escape_regex(word));
                if (name == word) {
                    list = Object.keys(commands);
                } else if (command.match(/\s/)) {
                    if (commands[name]) {
                        if (word.match(/^--/)) {
                            list = commands[name].options.map(function(option) {
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