const fs=require("fs")//file-system module
const { Queue } = require('queue-typescript')
let stopwords = fs.readFileSync('stop_words.txt', 'utf8').split(",");
let word_space = new Queue()
let freq_space = new Queue()
let num_of_promises = 5;
let word_freqs = {}
let array: any = []
let flage = false
function process_words(k) {
    let word_freqs = {};
    let word
    let v = setInterval(() => {
        if (word_space.length == 0) {
            freq_space.enqueue(word_freqs)
            //final do all main part
            final()
            clearInterval(v)
        }
        word = word_space.dequeue()
        //console.log(word+":"+k)
        if (stopwords.indexOf(word) == -1) {         
            if (word_freqs[word] == undefined) {
                word_freqs[word]=1
            }
            else {
                word_freqs[word]+=1
            }
        } 
    }, num_of_promises - k)
} 
let data = fs.readFileSync("inputFile.txt", "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" ")
for (let i = 0; i < data.length; i++){
    word_space.enqueue(data[i])
}
let arr:any=[]
for (let i = 0; i < 5; i++){
    arr.push(new Promise(function (resolve, reject) {
            process_words(i)    
            resolve(123)
    }))
}
function final() {
    num_of_promises-= 1
    if (num_of_promises == 0) {
        while (freq_space.length != 0) {
            let freq = freq_space.dequeue()
            console.log(Object.keys(freq).length)
            for (let i = 0; i < Object.keys(freq).length; i++){
                if (word_freqs[Object.keys(freq)[i]] == undefined) {
                    word_freqs[Object.keys(freq)[i]]=freq[Object.keys(freq)[i]]
                }
                else {
                    word_freqs[Object.keys(freq)[i]]+=freq[Object.keys(freq)[i]]
                }
            }
        }
        Object.keys(word_freqs).sort(function (a, b) { return word_freqs[b] - word_freqs[a] })
        .forEach(function (key) { array.push(`${key},${word_freqs[key]}`) });
    for (let i = 0; i < 25; i++){
        console.log("top25 ="+array[i])
        }  
    }
    else {
        console.log("not yet ")
    }
  
}


