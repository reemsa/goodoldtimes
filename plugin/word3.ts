export let extract_words = (path_to_file) => {
    const fs = require('fs')
    const sw = require('stopword')
    let word_list = (fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split("\n"))
    for (let i = 0; i < word_list.length; i++){
        word_list[i] = sw.removeStopwords(word_list[i].split(' ')) 
    }
    return word_list
}