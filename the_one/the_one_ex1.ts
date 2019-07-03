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
function filter_char(data):any {
    data=data.replace(/[^A-Za-z0-9]+/g," ")
    return data
 }
function normalize(data):any {
    return data.toLowerCase()
 }
 function scan(data) {
    return data.split(' ')
 }
 function remove_stop_word(word_list) {
    return sw.removeStopwords(word_list)
 }
 function frequencies(word_list) {
    let wf = {}
     for (let w = 0; w < word_list.length; w++){
         if (wf[word_list[w]] == undefined) {
           wf[word_list[w]]=1
         }
         else {
             wf[word_list[w]]+=1 
       }  
     }
     return wf
 }
 function sort(wf) {
     let array=[];
     Object.keys(wf).sort(function (a, b) { return wf[b] - wf[a] }).forEach(function(key) { array.push(`${key},${wf[key]}`)});
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
            top25 += array[i].split(',')[0] + "-" + array[i].split(',')[1] + "\n";
        }
    }
    return top25
  
 }

//the main function 
let one = new TheOne("inputFile.txt");
one.bind(read_file)
one.bind(filter_char)
one.bind(normalize)
one.bind(scan)
one.bind(remove_stop_word)
one.bind(frequencies)
one.bind(sort)
one.bind(top25_freqs)
one.printme()
