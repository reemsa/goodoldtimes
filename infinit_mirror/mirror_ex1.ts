const fs = require('fs')
let word_freq = {}
let array=[]
let RECURSION_LIMIT = 50//it supose to be larger than 50 but input file i am using is small
let stop_words = fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(",")
let input_file: any = fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')
function count(word_list:any[],stop_words:any[]) {
    
    if (word_list.length == 0) {
        return
    }
    else {
        let word = word_list[0]
        if (stop_words.indexOf(word) == -1) {
            if (word_freq[word] != undefined) {
                word_freq[word]+=1
            }
            else {
                word_freq[word]=1
            }
        } 
    }
    count(word_list.splice(1,word_list.length-1),stop_words)
}

function wf_print(word_freq:any[]) {
    if (word_freq.length == 0) {
        return
    }
    else {
        console.log("data=" + word_freq[0])
        wf_print(word_freq.splice(1,word_freq.length-1))
    }
}

//main function 
for (let i = 0; i < input_file.length; i = i + RECURSION_LIMIT) {
    let data=input_file.slice(i,i+RECURSION_LIMIT);
   count(data,stop_words)
}
let x= Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] }).forEach(function(key) { array.push(`${key},${word_freq[key]}`)});
wf_print(array.splice(0,25))
