//do reflevtion for stop word and frequencies_imp if possible 
const fs = require('fs')
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
function x(name) {
    /*here we do reflection for finding stop word but we can not do reflection
    for frequencies_imp function because it is hard to convert it to one line  */
    let stops=eval("fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(',')")
    let data=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g, ' ').toLowerCase().split(" ")
    let array = []
    for (let i = 0; i < data.length; i++){
        if (stops.indexOf(data[i] as never) == -1) {
            array.push(data[i]) 
        }
    }
    return array
}
function sorted(word_freqs) {
    let array:any=[]
    Object.keys(word_freqs).sort(function (a, b) { return word_freqs[b] - word_freqs[a] })
        .forEach(function (key) { array.push(`${key},${word_freqs[key]}`) });
    return array
}
let name2 = 'inputFile.txt'
let extract_words_func = "x(name2)"
let frequencies_func = "frequencies_imp(eval(extract_words_func))"
let  sort_func="sorted(eval(frequencies_func))"
let r = eval(sort_func)
for (let i = 0; i < 25; i++){
    console.log("top25 ="+r[i])
}

