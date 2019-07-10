const fs = require('fs');//used to open files

class TFQuarantine{
    static _funcs=[]
    constructor(func) {
        TFQuarantine._funcs=[func]
    }
    bind(func) {
        TFQuarantine._funcs.push(func)
      return TFQuarantine._funcs 
    }
    execute() {
        let guard_callable=(v)=>{
            if (typeof (v) == "function") {
                return v()
            }
            return v
        }
        let v=()=> {
            
        }
        for (let i = 0; i < TFQuarantine._funcs.length; i++){
           v=TFQuarantine._funcs[i](guard_callable(v)) 
        }
    }
}
 
let get_input = (...arg) => {
    function _f() {
     return "inputFile.txt"   
    }
    return _f
}
let extract_words = (path_to_file)=>{
    function _f() {
        return fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')
    }
    return _f
}
let remove_stop_words = (word_list) => {
    function _f() {
        let stop_words = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
        let array=[]
        for (let i = 0; i < word_list.length; i++){
            if (stop_words.indexOf(word_list[i]) == -1) {
              array.push(word_list[i])  
            }
        }
       return array
    }
    return _f
}
let frequencies=(word_list) => {
        let word_freqs = {}
        for (let w = 0; w < word_list.length;w++) {
            if (word_freqs[word_list[w]] == undefined) {
                word_freqs[word_list[w]] = 1 
            }
            else {
               word_freqs[word_list[w]] += 1
            }
        } 
        return word_freqs
   
}
let sort = (word_freq) => {
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
.forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
return array
}
let top25_freqs = (word_freqs) => {
    for (let i = 0; i < 25; i++){
        console.log("top25 = "+word_freqs[i])
    }
}
let x: TFQuarantine = new TFQuarantine(get_input);
x.bind(extract_words)
x.bind(remove_stop_words)
x.bind(frequencies)
x.bind(sort)
x.bind(top25_freqs)
x.execute()
 


