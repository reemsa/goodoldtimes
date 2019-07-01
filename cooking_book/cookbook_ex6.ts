const fs = require('fs');//used to open files
let data = []
let word = []
let file_line=[]
let word_freq = []
//the procedures
const isAlphaNumeric = (ch: string) => {
    if (ch == '\n') {
        return true
    }
    return ch.match(/^[a-z0-9]+$/i) !== null;
}
function readfilt(path: string) {
    data = fs.readFileSync(path, 'utf8').split('') 
}
function filter_chars_and_normalize() {
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
}
function scan() {
    let data_str = data.join('')
    let flage=false
    file_line = data_str.split('\n')
    for (let i = 0; i < file_line.length; i++){
        file_line[i]=file_line[i].split(' ')
        //console.log(file_line[i])
        for (let j = 0; j < file_line[i].length; j++){
           // console.log(file_line[i][j])
            if (file_line[i][j] != '') {
               // if (word.length == 0) {
                    //console.log("inside len=0")
                    let page_no = Number(Math.floor(i / 10) + 1)
                    let page_no_st=String(page_no)
                    word.push(file_line[i][j]+"-"+page_no_st)
               // }
                // else {
                //    // console.log("inside else");
                //     for (let j = 0; j < word.length; j++){
                //         if (word[j].split('-')[0].trim() == file_line[i][j]) {
                //             if (word[j].split('-')[1].split(',').indexOf(String(i)) == -1) {
                //                 let page_no = Number(Math.floor(i / 10) + 1)
                //                 let page_no_st=String(page_no)
                //                 word[j]=file_line[i][j]+"-"+word[j].split('-')[1]+","+page_no_st
                //             }
                //             flage=true
                //             break
                //         }
                       
                //     }
                //     if (!flage) {
                //         let page_no = Number(Math.floor(i / 10) + 1)
                //         let page_no_st=String(page_no)
                //         word.push(file_line[i][j]+"-"+page_no_st)
                //     }
                //     flage=false
                // }  
            }
           
        }
    }  
}
function remove_stop_words() {
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
}
function frequencies() {
    let flage = false
    let count=0
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
}
function sort() {
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
    for (let i = 0; i < word_freq.length; i++){
        //in the task ask to ignore word has freq more than 100  but here i supose 25 
        if (word_freq[i].split(',')[1] < 25) {
            console.log("data = "+word_freq[i].split(',')[0]+"-"+word_freq[i].split(',')[2])  
        }
        
    }
}
function main() {
    readfilt("inputFile.txt")
    filter_chars_and_normalize()
    scan()
    remove_stop_words()
    frequencies()
    sort()
    
}

main()
