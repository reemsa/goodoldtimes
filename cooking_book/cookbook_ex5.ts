const fs = require('fs');//used to open files
let data = []
let word = []
let word_freq = []
//the procedures
const isAlphaNumeric = (ch: string) => {
    return ch.match(/^[a-z0-9]+$/i) !== null;
}
function readfilee(path: string) {
    data = fs.readFileSync(path, 'utf8').split('') 
}
function filter_chars_and_scan() {
    for (let i = 0; i < data.length; i++){
        if (!isAlphaNumeric(data[i])) {
            data[i]=' '
        }
        else {
            data[i]=data[i].toLowerCase()
        }
    }
    let data_str = data.join('')
    let index=[]
    word = data_str.split(' ')
    let stop_words = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
    for (let i = 0; i < word.length; i++){
        if (stop_words.indexOf(word[i])==-1&&word[i]!='') {
           index.push(word[i]) 
        }
        else {
            
        }
    }
    word = index
}

function frequencies() {
    let flage = false
    let count=0
    for (let i = 0; i < word.length; i++){
        //console.log("word="+word[i])
        if (word_freq.length == 0) {
            let x = word[i] + "," + 1+'\n'
            word_freq[count] = x;
           // console.log(  word_freq[count])
            count++
            //console.log("inside len=0")
        }
        else {
           // console.log(word_freq.length)
            for (let j = 0; j < word_freq.length; j++){
                //console.log("split="+word_freq[j].split(',')[0])
                if (word_freq[j].split(',')[0] == word[i]) {
                   // console.log("inside if ")
                    let freq=Number(word_freq[j].split(',')[1])+1
                    word_freq[j] = word_freq[j].split(',')[0] + "," + freq + '\n' 
                    //console.log(  word_freq[j])
                    flage=true
                    break
                }
            }
            if (!flage) {
                word_freq[count] = word[i] + "," + 1 + '\n'
                //console.log(  word_freq[count])
                count++
            
              //  word_freq.push(word[i]+","+ 1); 
            }
            flage = false
        }
    }
}
function sort() {
    let tmp:any
    for (let i = 0; i < word_freq.length;i++){
            for (let j = i + 1; j < word_freq.length;j++){
                if (Number(word_freq[i].split(',')[1])<Number(word_freq[j].split(',')[1])) {
                    tmp = word_freq[i]
                    word_freq[i] = word_freq[j]
                    word_freq[j]=tmp
                }
            }
    }
    for (let i = 0; i < word_freq.length; i++){
        console.log("data = "+word_freq[i])
    }
}
function main() {
    readfilee("inputFile.txt")
    filter_chars_and_scan()
    frequencies()
    sort()
    
}

main()
