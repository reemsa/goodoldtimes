export let extract_words = (path_to_file) => {
    const fs = require('fs')
    const sw = require('stopword')
    let input=sw.removeStopwords(fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase().split(" "))
    return input
}