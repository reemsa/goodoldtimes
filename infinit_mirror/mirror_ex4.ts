const fs = require('fs')
var lineNumber = require('linenumber');
let word_freq = {}
let mainarray = []
let mainarray3 = []
let mainarray2={}
let RECURSION_LIMIT = 50//it supose to be larger than 50 but input file i am using is small
var fixture = fs.readFileSync('inputFile.txt', 'utf8').toLowerCase();
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
        if (Number(word_freq[0].split(',')[1]) <= 20) {
            console.log("data=" + word_freq[0].split(",")[0]+"-"+ word_freq[0].split(",")[2])

        }
        wf_print(word_freq.splice(1,word_freq.length-1))
     
    }
}
function find_line(array: any[]) {
    if (array.length == 0) {
        mainarray=array
        return
    }
    var regex = new RegExp(array[0].split(',')[0].trim(), "g");
    if (array[0].split(',')[0].trim() == '') {
    }
    else {
      
    let u = lineNumber(fixture, regex)
    for (let l = 0; l < u.length; l++){
          
            if (array[0].split(',')[2] == undefined) {
                array[0] = array[0] + "," + String(Number(Math.floor(u[l].line / 10) + 1))
                mainarray2[array[0].split(',')[0]]=array[0]
            }
            else {
                if (array[0].split(',')[2].split('.').indexOf(String(Number(Math.floor( u[l].line/ 10) + 1)))==-1) {
                    array[0] = array[0] + "." + String(Number(Math.floor(u[l].line / 10) + 1));
                    mainarray2[array[0].split(',')[0]]=array[0]
                }
            }  
       
    }
    }
   
    find_line(array.slice(1,array.length))
}


//main function 
let stop_words = fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(",")
let input_file: any = fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')
for (let i = 0; i < input_file.length; i = i + RECURSION_LIMIT) {
    let data=input_file.slice(i,i+RECURSION_LIMIT);
   count(data,stop_words)
}
let x = Object.keys(word_freq).sort().forEach(function (key) { mainarray.push(`${key},${word_freq[key]}`) });
find_line(mainarray.slice(1, mainarray.length - 1))
x = Object.keys(mainarray2).sort().forEach(function (key) { mainarray3.push(`${mainarray2[key]}`) });
wf_print(mainarray3)
