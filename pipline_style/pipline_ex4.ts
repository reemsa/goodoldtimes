const fs = require('fs');//used to open files
// let data = []
// let word = []
// let file_line=[]
// let word_freq = []
//the procedures
const isAlphaNumeric = (ch: string) => {
    if (ch == '\n') {
        return true
    }
    return ch.match(/^[a-z0-9]+$/i) !== null;
}
function readfilt(path: string):any[] {
    let data = fs.readFileSync(path, 'utf8').split('')
    return data
}
function filter_chars_and_normalize(data:any[]):any[] {
    for (let i = 0; i < data.length; i++){
        if (!isAlphaNumeric(data[i])) {
            data[i] = ' '
        }
        else {
            if (data[i] == '\n') {
                data[i]=data[i]+' ' 
            }
    
            data[i]=data[i].toLowerCase()
        }
    }
    return data
}
function scan(data: any[]): any {
    let word=[]
        let data_str = data.join('')
    let flage = false
    let file_line=[]
     file_line = data_str.split('\n')
    for (let i = 0; i < file_line.length; i++){
        file_line[i]=file_line[i].split(' ')
        //console.log(file_line[i])
        for (let j = 0; j < file_line[i].length; j++){
            if (file_line[i][j] != '') {
                    let page_no = Number(Math.floor(i / 10) + 1)
                    let page_no_st=String(page_no)
                    word.push(file_line[i][j]+"-"+page_no_st)
              
            }
           
        }
        } 
        return word
    
     
}
function remove_stop_words(word:any[]):any[] {
    let index=[]
    let stop_words = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
    for (let i = 0; i < word.length; i++){
        if (stop_words.indexOf(word[i].split('-')[0]) == -1 && word[i] != '') {
            word[i]=word[i]+' '
           index.push(word[i]) 
        }
        else {
            
        }
    }
    word = index   
    return word
}
function frequencies(word:any[]):any[] {
    let flage = false
    let count = 0
    let word_freq=[]
    for (let i = 0; i < word.length; i++){
        if (word_freq.length == 0) {
            let page_no = Number(Math.floor(count / 10) + 1)
            let x = word[i].split('-')[0] + "," + 1 + ',' + word[i].split('-')[1] + '\n'
            word_freq[count] = x;
            count++
        }
        else {
            for (let j = 0; j < word_freq.length; j++){
                if (word_freq[j].split(',')[0].trim()== word[i].split("-")[0]) {
                    if (word_freq[j].trim().split(',')[2].split('.').indexOf(word[i].split("-")[1].trim()) == -1) {
                        let freq = Number(word_freq[j].split(',')[1]) + 1
                        let lines = word_freq[j].split(',')[2].trim() + '.' + word[i].split("-")[1];
                        word_freq[j] = word_freq[j].split(',')[0] + "," + freq + "," + lines + '\n'  
                    }
                    else {
                        let freq=Number(word_freq[j].split(',')[1])+1
                        word_freq[j] = word_freq[j].split(',')[0] + "," + freq +","+word_freq[j].split(',')[2].trim()+'\n' 
                    }
                    flage=true
                    break
                }
            }
            if (!flage) {
                word_freq[count] = word[i].split('-')[0] + "," + 1 +","+word[i].split('-')[1]+ '\n'
                count++
            }
            flage = false
        }
    }
    return word_freq
}
function sort(word_freq:any[]):any[] {
    let tmp:any
    for (let i = 0; i < word_freq.length;i++){
        for (let j = i + 1; j < word_freq.length; j++){
            if (word_freq[i].split(',')[0].trim() > word_freq[j].split(',')[0].trim()) {
                    tmp = word_freq[i]
                    word_freq[i] = word_freq[j]
                    word_freq[j]=tmp
                }
            }
    }
    return word_freq
  
}
function print(word_freq:any[]) {
    for (let i = 0; i < word_freq.length; i++){
        //in the task ask to ignore word has freq more than 100  but here i supose 25 
        if (word_freq[i].split(',')[1] < 25) {
            console.log("data = "+word_freq[i].split(',')[0]+"-"+word_freq[i].split(',')[2])  
        }
        
    }   
}
print(sort(frequencies(remove_stop_words( scan(filter_chars_and_normalize(readfilt("inputFile.txt")))))))  
