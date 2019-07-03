const fs = require('fs')
const sw = require('stopword')
function read_file(file_path: string, func) {
    let input_file=fs.readFileSync(file_path, 'utf8')
    func(input_file,normalize);
}
function filter_char(data, func) {
   data=data.replace(/[^A-Za-z0-9]+/g," ")
   func(data,scan)
}
function normalize(data, func) {
    func(data.toLowerCase(),remove_stop_word)
}
function scan(data, func) {
    func(data.split(' '),frequencies)
}
function remove_stop_word(word_list, func) {
    word_list=sw.removeStopwords(word_list)
    func(word_list,sort)
}
function frequencies(word_list, func) {
   let wf = {}
    for (let w = 0; w < word_list.length; w++){
        if (wf[word_list[w]] == undefined) {
          wf[word_list[w]]=1
        }
        else {
            wf[word_list[w]]+=1 
      }  
    }
    func(wf,print_text)
}
function sort(wf, func) {
    let array=[];
    Object.keys(wf).sort(function (a, b) { return wf[b] - wf[a] }).forEach(function(key) { array.push(`${key},${wf[key]}`)});
    func(array,no_op)
}
function print_text(array, func) {
    for (let i = 0; i < 25; i++){
        console.log("data = "+array[i])
    }
    func()
}
function no_op() {
    return
}
read_file("inputFile.txt",filter_char)