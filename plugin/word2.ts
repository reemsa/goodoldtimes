export let extract_words = (path_to_file) => {
    const fs = require('fs')
    let array:any[]=[]
    let input = fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(" ")
    let stop_word = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(",")
    for (let i = 0; i < input.length; i++){
        if (stop_word.indexOf(input[i]) == -1) {
            array.push(input[i])
        } 
    }
    return array
}