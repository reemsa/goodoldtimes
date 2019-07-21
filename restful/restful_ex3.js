var fs = require('fs');
var stops = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',');
var data = {};
var readlineSync = require('readline-sync');
function error_state() {
    return ["Something wrong", ["get", "default", null]];
}
//The "server"-side application handlers
function default_get_handler(args) {
    var rep = "What would you like to do?";
    rep += "\n1 - Quit" + "\n2 - Upload file";
    var links = {};
    links['1'] = ["post", "execution", null];
    links['2'] = ["get", "file_form", null];
    //links = {"1" : ["post", "execution", null], "2" : ["get", "file_form", null]}
    return [rep, links];
}
function quit_handler(args) {
    process.exit(1);
}
function upload_get_handler(args) {
    return ["Name of file to upload?", ["post", "file"]];
}
function upload_post_handler(args) {
    function create_data(filename) {
        console.log("hh");
        if (data[filename] != undefined) {
            return;
        }
        var word_freqs = {};
        var words = fs.readFileSync(filename, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split("\n");
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].split(" ");
            for (var j = 0; j < words[i].length; j++) {
                if (stops.indexOf(words[i][j]) == -1) {
                    console.log(words[i][j]);
                    if (word_freqs[words[i][j]] == undefined) {
                        word_freqs[words[i][j]] = [1, String(Number(Math.floor(i / 10) + 1))];
                    }
                    else {
                        word_freqs[words[i][j]][0] += 1;
                        if (word_freqs[words[i][j]][1].split("-").indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
                            word_freqs[words[i][j]][1] += "-" + String(Number(Math.floor(i / 10) + 1));
                        }
                    }
                }
            }
        }
        var array = [];
        Object.keys(word_freqs).sort().forEach(function (key) { array.push(key + "," + word_freqs[key]); });
        console.log(array);
        data[filename] = array;
    }
    if (args == null) {
        return error_state();
    }
    try {
        create_data(args);
    }
    catch (error) {
        console.log("Unexpected error");
        return error_state();
    }
    return word_get_handler([args, 0]);
}
function word_get_handler(args) {
    function get_word(filename, word_index) {
        if (word_index < data[filename].length) {
            return data[filename][word_index];
        }
        else {
            return ["no more words", 0];
        }
    }
    var filename = args[0];
    var word_index = args[1];
    var word_info = get_word(filename, word_index);
    // let rep = '\n'+(word_index+1)+":"+ word_info[0]+"-"+ word_info[1]
    var rep = '\n' + (word_index + 1) + ":" + word_info;
    rep += "\nWhat would you like to do next?";
    rep += "\n1 - Quit" + "\n2 - Upload file";
    rep += "\n3 - See word pages";
    var links = { "1": ["post", "execution", null],
        "2": ["get", "file_form", null],
        "3": ["get", "word", [filename, word_index + 1]] };
    return [rep, links];
}
var handlers = {};
handlers["post_execution"] = quit_handler;
handlers["get_default"] = default_get_handler;
handlers["get_file_form"] = upload_get_handler;
handlers["post_file"] = upload_post_handler;
handlers["get_word"] = word_get_handler;
function handle_request(verb, uri, args) {
    function handler_key(verb, uri) {
        return verb + "_" + uri;
    }
    if (handlers[handler_key(verb, uri)] != undefined) {
        return handlers[handler_key(verb, uri)](args);
    }
    else {
        return handlers[handler_key("get", "default")](args);
    }
}
var input = "";
function render_and_get_input(state_representation, links) {
    console.log(state_representation);
    if (Array.isArray(links)) {
        if (links[0] == "post") {
            input = readlineSync.question('');
            links.push(input);
            return links;
        }
        else
            return links;
    }
    else if (typeof (links) == "object") {
        input = readlineSync.question('');
        if (links[input] != undefined) {
            return links[input];
        }
        else
            return ["get", "default", null];
    }
    else
        return ["get", "default", null];
}
var req = ['get', 'default', null];
while (true) {
    var rep = handle_request(req[0], req[1], req[2]);
    req = render_and_get_input(rep[0], rep[1]);
}
