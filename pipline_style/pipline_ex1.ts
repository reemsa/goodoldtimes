const fs = require('fs');//used to open files

const isAlphaNumeric = (ch: string) => {
    // if (ch == '\n') {
    //     return true
    // }
    return ch.match(/^[a-z0-9]+$/i) !== null;
}
function readfilt(path: string):any[] {
    let data=[]
    data = fs.readFileSync(path, 'utf8').split('') 
    return data
}
function filter_chars_and_normalize(data:any[]):any[] {
    for (let i = 0; i < data.length; i++){
        if (!isAlphaNumeric(data[i])) {
            data[i]=' '
        }
        else {
            data[i]=data[i].toLowerCase()
        }
    }
    return data
}
function scan(data:any[]):any[] {
    let data_str = data.join('')
    let word = data_str.split(' ')
    return word 
}
function remove_stop_words(word:any[]):any[] {
    let index=[]
    let stop_words = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
    for (let i = 0; i < word.length; i++){
        if (stop_words.indexOf(word[i])==-1&&word[i]!='') {
           index.push(word[i]) 
        }
        else {
            
        }
    }
    word = index
    return word
    //console.log(word)
}
function frequencies(word:any[]):any[] {
    let flage = false
    let count = 0
    let word_freq=[]
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
    return word_freq
}
function sort(word_freq:any[]):any[] {
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
    return word_freq;
   
}
function print(word_freq:any[]) {
    for (let i = 0; i < word_freq.length; i++){
        console.log("data = "+word_freq[i])
    } 
}
//main function 
print(sort(frequencies(remove_stop_words( scan(filter_chars_and_normalize(readfilt("inputFile.txt")))))))   



