const fs=require("fs")//file-system module
const { Queue } = require('queue-typescript')
let stopwords = fs.readFileSync('stop_words.txt', 'utf8').split(",");
let word_space = new Queue()
let freq_space = new Queue()
let num_of_promises = 5;
let word_freqs = {}
function process_words(k,resolve) {
    let word_freqs = {};
    let word
    let v = setInterval(() => {
        if (word_space.length == 0) {
            freq_space.enqueue(word_freqs)
            resolve()
            clearInterval(v)
        }
        word = word_space.dequeue()
        if (word == undefined) { }
        else {
            if (stopwords.indexOf(word[0]) == -1) {         
                if (word_freqs[word[0]] == undefined) {
                    word_freqs[word[0]]=[word[0],1,word[1]]
                }
                else {
                    word_freqs[word[0]][1] += 1
                    if (word_freqs[word[0]][2].split("-").indexOf(word[1]) == -1) {
                        word_freqs[word[0]][2]=word_freqs[word[0]][2]+"-"+word[1]
                    }
                } 
                } 
        }
    }, num_of_promises - k)
} 
async function main() {
    let data = fs.readFileSync("inputFile.txt", "utf8").toLowerCase().replace(/[^A-Za-z0-9\n]+/g, " ").split("\n")
    for (let i = 0; i < data.length; i++){
        data[i]=data[i].split(" ")
        for (let j = 0; j < data[i].length; j++){
            word_space.enqueue([data[i][j],String(Number(Math.floor(i / 10) + 1))]) 
        }
}
let arr:any=[]
for (let i = 0; i < 5; i++){
    arr.push(new Promise(function (resolve, reject) {
      process_words(i,resolve)    
    }))
}
    await Promise.all(arr)

while (freq_space.length!=0) {
    let freq = freq_space.dequeue()
    for (let i = 0; i < Object.keys(freq).length; i++){
        if (word_freqs[Object.keys(freq)[i]] == undefined) {
            word_freqs[Object.keys(freq)[i]] = freq[Object.keys(freq)[i]]
            //console.log("un="+word_freqs[Object.keys(freq)[i]])
        }
        else {
            //console.log("be="+word_freqs[Object.keys(freq)[i]]+":"+freq[Object.keys(freq)[i]])
            word_freqs[Object.keys(freq)[i]][1] += freq[Object.keys(freq)[i]][1]
            let fre = freq[Object.keys(freq)[i]][2].split("-")
            for (let j = 0; j < fre.length; j++){
                if (word_freqs[Object.keys(freq)[i]][2].split("-").indexOf(fre[j]) == -1) {
                    word_freqs[Object.keys(freq)[i]][2]+="-"+fre[j]  
                }
            }
            //console.log("af="+word_freqs[Object.keys(freq)[i]])
        }
    }
}
let array:any=[]
Object.keys(word_freqs).sort()
    .forEach(function (key) { array.push(`${word_freqs[key]}`) });
    for (let i = 1; i < array.length; i++){
    //console.log(array[i])
    console.log("word ="+array[i].split(",")[0]+":"+array[i].split(",")[2])
}
}
main()