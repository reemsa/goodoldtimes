export let extract_words = (path_to_file) => {
    const fs = require('fs')
    const sw = require('stopword')
    let input=sw.removeStopwords(fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase().split(" "))
    return input
}
export let top25 = (word_list) => {
    let word_freq={}
    for (let i = 0; i < word_list.length; i++){
        if (word_freq[word_list[i]] == undefined) {
            word_freq[word_list[i]] = 1 
        }
        else {
            word_freq[word_list[i]] += 1
        }
    }
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
        .forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
    array=array.slice(0,25)
return array
}
let word_freqs = top25(extract_words("inputFile.txt"))
console.log(word_freqs)