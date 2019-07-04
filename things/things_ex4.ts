const fs = require('fs')
const sw = require('stopword')
let word_freq = {}
let array:any=[]
function word(name) {
    return sw.removeStopwords(fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase().split(' '))
}
function increment_count(word) {
       
        if (word_freq[word] == undefined) {
            word_freq[word] = 1 
        }
        else {
            word_freq[word] += 1
        }
}
function sorted() {
        let x = Object.keys(word_freq)
        let data = word_freq
                
        Object.keys(data).sort(function (a, b) { return data[b] - data[a] }).forEach(function (key) { array.push(`${key},${data[key]}`) });
        return array
}
function run() {
        let t = word("inputFile.txt")
        for (let i = 0; i < t.length; i++){
               increment_count(t[i])
        }
        let wordfreq = sorted()
        for (let i = 0; i < wordfreq.length; i++){
            console.log("data = "+wordfreq[i])
        }
}

run()
