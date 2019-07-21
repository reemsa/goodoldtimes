const fs = require('fs')
let stops:any[]= fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
let data = {}
var readlineSync=require('readline-sync')
function error_state() {
    return ["Something wrong", ["get", "default", null]]
}
//The "server"-side application handlers
function default_get_handler(args) {
    let rep = "What would you like to do?"
    rep += "\n1 - Quit" + "\n2 - Upload file"
    let links = {}
    links['1'] = ["post", "execution", null]
    links['2']=["get", "file_form", null]
 //links = {"1" : ["post", "execution", null], "2" : ["get", "file_form", null]}
    return [rep, links]
}
function quit_handler(args) {
   process.exit(1) 
}
function upload_get_handler(args) {
    return ["Name of file to upload?", ["post", "file"]]
}
function upload_post_handler(args){
    function create_data(filename) {
        if (data[filename] != undefined) {
            return
        }
        let word_freqs = {}
        let words = fs.readFileSync(filename, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(" ")
        for (let i = 0; i < words.length; i++){
            if (stops.indexOf(words[i]) == -1) { 
                if (word_freqs[ words[i]] == undefined) {
                    word_freqs[ words[i]] = 1
                }
                else {
                    word_freqs[ words[i]] += 1
                }
            }
               
        }
        let array:any=[]
        Object.keys(word_freqs).sort(function (a, b) { return word_freqs[b] - word_freqs[a] }).forEach(function (key) { array.push(`${key},${word_freqs[key]}`) });
        data[filename] = array
    }
    if (args == null) {
        return error_state()
    }
    try {
       create_data(args) 
    }
    catch (error) {
        console.log("Unexpected error")
        return error_state()
    }
    return word_get_handler([args, 0])
}
function word_get_handler(args) {
    function get_word(filename, word_index) {
        if (word_index < data[filename].length) {
            return data[filename][word_index]
        }
        else { return["no more words", 0] }
    }
    
    let filename = args[0];
    let word_index = args[1]
    let word_info = get_word(filename, word_index)
   // let rep = '\n'+(word_index+1)+":"+ word_info[0]+"-"+ word_info[1]
   let rep = '\n'+(word_index+1)+":"+ word_info
    rep += "\nWhat would you like to do next?"
    rep += "\n1 - Quit" + "\n2 - Upload file"
    rep += "\n3 - See next most-frequently occurring word"
    rep +="\n4 - See pre most-frequently occurring word"

    let links = {"1" : ["post", "execution", null],
             "2" : ["get", "file_form", null],
        "3": ["get", "word", [filename, word_index + 1]],
    "4":["get","word", [filename, word_index-1 ]]}
    return [rep, links]
    
}
let handlers = {}
handlers["post_execution"] = quit_handler
handlers["get_default"] = default_get_handler
handlers["get_file_form"] =  upload_get_handler
handlers["post_file"] = upload_post_handler
handlers["get_word"] = word_get_handler
function handle_request(verb, uri, args) {
    function handler_key(verb, uri){
        return verb + "_" + uri
    }
    if (handlers[handler_key(verb, uri)] != undefined) {
        return handlers[handler_key(verb, uri)](args)  
    }
    else {
        return handlers[handler_key("get", "default")](args)
    }
}
let input=""
function render_and_get_input(state_representation, links) {
    console.log(state_representation)
    if (Array.isArray(links)) {
        if (links[0]=="post"){
        input = readlineSync.question('');
        links.push(input)
        return links
        }
        else return links
    }
    else if (typeof (links) == "object") {
        input = readlineSync.question('');
        if (links[input]!=undefined){
            return links[input]
        }
        else return ["get","default",null]
    }
    else 
        return ["get","default",null]
}
let req = ['get', 'default', null]
while (true) {
    let rep = handle_request(req[0], req[1], req[2])
    req=render_and_get_input(rep[0],rep[1])
    
}
