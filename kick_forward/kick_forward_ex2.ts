const fs = require('fs')
const sw = require('stopword')
let input_file;
let array=[];
let wf;
function read_file(file_path: string, func) {
    input_file=fs.readFileSync(file_path, 'utf8')
    func(input_file,normalize);
}
function filter_char(data, func) {
   data=data.replace(/[^A-Za-z0-9\n]+/g," ")
   func(data,scan_line)
}
function normalize(data, func) {
    func(data.toLowerCase(),remove_stop_word)
}
function scan_line(data, func) {
    func(data.split('\n'),frequencies) 
}

function remove_stop_word(word_list, func) {
    for (let i = 0; i < word_list.length; i++){
        word_list[i] = sw.removeStopwords(word_list[i].split(' ')) 
    }
    func(word_list,sort)
}
function frequencies(word_list, func) {
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
    func(wf,print_text)
}
function sort(wf, func) {
    Object.keys(wf).sort().forEach(function (key) { array.push(`${wf[key]}`) });
    func(array,no_op)
}
function print_text(array, func) {
    for (let i = 0; i < array.length; i++){
        if(array[i].split(',')[1]<25){ console.log("data = "+array[i].split(',')[0]+":"+array[i].split(',')[2])}
    }
    func()
}
function no_op() {
    return
}
read_file("inputFile.txt",filter_char)