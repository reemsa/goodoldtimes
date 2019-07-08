const fs = require('fs')
const sw = require('stopword')
let stops:[] = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
function frequencies_imp(word_list) {
    let  word_freqs = {}
    for (let i = 0; i < word_list.length; i++){
        if (word_freqs[word_list[i]] == undefined) {
            word_freqs[word_list[i]]=1
        }
        else {
            word_freqs[word_list[i]]+=1 
        }
    }
    return word_freqs
}
function sorted(word_freqs) {
    let array:any=[]
    Object.keys(word_freqs).sort(function (a, b) { return word_freqs[b] - word_freqs[a] })
        .forEach(function (key) { array.push(`${key},${word_freqs[key]}`) });
    return array
}
let name2 = 'inputFile.txt'
let data
let array:any=[]
let extract_words_func = "sw.removeStopwords(fs.readFileSync(name2, 'utf8').replace(/[^A-Za-z0-9]+/g,' ').toLowerCase().split(' '))"
let frequencies_func = "frequencies_imp(data=eval(extract_words_func))"
let  sort_func="sorted(eval(frequencies_func))"
let r = eval(sort_func)
for (let i = 0; i < 25; i++){
    console.log("top25 ="+r[i])
}

