const fs = require('fs');//used to open files
const sw = require('stopword')
class TheOne{
     value;
    constructor(v) {
     this.value=v   
    }
    bind(func_name) {
       this.value= func_name(this.value)
    }
    printme() {
        console.log(this.value)
    }
    
}
function read_file(file_path: string) {
    return fs.readFileSync(file_path, 'utf8')
}
function filter_char(data) {
   return data.replace(/[^A-Za-z0-9\n]+/g," ")
}
function normalize(data) {
    return data.toLowerCase()
}
function scan_line(data) {
    return data.split('\n')
}

function remove_stop_word(word_list) {
    for (let i = 0; i < word_list.length; i++){
        word_list[i] = sw.removeStopwords(word_list[i].split(' ')) 
    }
    return word_list
}
function frequencies(word_list) {
   let wf = {}
    for (let i = 0; i < word_list.length; i++){
        for (let j = 0; j < word_list[i].length; j++){
            if (word_list[i][j] != '') {
                if (wf[word_list[i][j]] == undefined) {
                    wf[word_list[i][j]] = [word_list[i][j], 1, String(Number(Math.floor(i / 10) + 1))]
                }
                else {
                    wf[word_list[i][j]][1] = wf[word_list[i][j]][1]+1
                    if (wf[word_list[i][j]][2].split('-').indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
                        wf[word_list[i][j]][2] = wf[word_list[i][j]][2]+"-"+String(Number(Math.floor(i / 10) + 1))
                    }
                }
            }
         

        }
    }
    return wf
}
function sort(wf) {
    let array=[];
    Object.keys(wf).sort().forEach(function (key) { array.push(`${wf[key]}`) });
    return array
}
function top25_freqs(array) {
    let top25 = ""
    let x=25
    for (let i = 0; i < x; i++){
        if (array[i].split(',')[0] == '') {
             x=26
        }
        else {
            top25 += array[i].split(',')[0] + "-" + array[i].split(',')[2] + "\n";
        }
    }
    return top25
  
 }
//the main function 
let one = new TheOne("inputFile.txt");
one.bind(read_file)
one.bind(filter_char)
one.bind(normalize)
one.bind(scan_line)
one.bind(remove_stop_word)
one.bind(frequencies)
one.bind(sort)
one.bind(top25_freqs)
one.printme()


