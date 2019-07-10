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
        return fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split('\n')
    }
    return _f
}
let remove_stop_words = (word_list) => {
    function _f() {
        let stop_words = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
        let array = []
        for (let i = 0; i < word_list.length; i++){
            word_list[i]=word_list[i].split(" ")
            for (let j = 0; j < word_list[i].length; j++){
                if (stop_words.indexOf(word_list[i][j]) == -1) {
                    array.push([word_list[i][j],i])  
                  }
            }
        }
       return array
    }
    return _f
}
let frequencies = (word_list) => {
    let word_freq= {}
    for (let w = 0; w < word_list.length; w++) {
        let word = word_list[w]
        if (word_freq[word[0]] == undefined) {
            word_freq[word[0]] = [word[0],1,String(Number(Math.floor(word[1] / 10) + 1))] 
        }
        else {
            word_freq[word[0]][1] += 1
            if (word_freq[word[0]][2].split("-").indexOf(String(Number(Math.floor(word[1] / 10) + 1))) == -1) {
                word_freq[word[0]][2]=word_freq[word[0]][2]+"-"+String(Number(Math.floor(word[1]  / 10) + 1))
            }
        } 
    } 
    return word_freq
   
}
let sort = (word_freq) => {
    let array:any=[]
    Object.keys(word_freq).sort()
.forEach(function (key) { array.push(`${word_freq[key]}`) });
return array
}
let top25_freqs = (word_freqs) => {
    for (let i = 0; i < word_freqs.length; i++){
        //if freq larger then 25 ignore it in task ask if freq larger than 100 but here i am using 25 
        if (word_freqs[i].split(",")[1] < 25) {
            console.log("data = "+word_freqs[i].split(',')[0]+":"+word_freqs[i].split(',')[2])
            }
            
        }
}
let x: TFQuarantine = new TFQuarantine(get_input);
x.bind(extract_words)
x.bind(remove_stop_words)
x.bind(frequencies)
x.bind(sort)
x.bind(top25_freqs)
x.execute()
 


