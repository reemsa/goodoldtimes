const fs = require('fs')
function extract_word(obj, path_file) {
    let x = fs.readFileSync(path_file, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split('\n') 
    obj.data = x;
}

function load_stop_word(obj) {

    let x = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',') 
    obj.stop_words=x
}
function incremant_count(obj, w,i) {
    if (obj.freq[w] == undefined) {
        obj.freq[w]=[1,String(Number(Math.floor(i / 10) + 1))]
    }
    else {
        obj.freq[w][0] += 1
        if (obj.freq[w][1].split('-').indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
            obj.freq[w][1]=obj.freq[w][1]+"-"+String(Number(Math.floor(i / 10) + 1)) 
        }
    }
    
}
let data_storg_obj ={
    data: [],
    init: function (path_file) {
     extract_word(data_storg_obj,path_file)   
    },
    words: function () {
        return data_storg_obj.data
    }
}

let stop_word_obj = {
    stop_words: [],
    init: function () {
        load_stop_word(stop_word_obj)
    },
    is_stop_word: function (word) {
        if (stop_word_obj.stop_words.indexOf(word) == -1) {
            return false
        }
        return true
    }
}

let word_freqs_obj = {
    freq: {},
    array:[],
    incremnt_count: function (w,i) {
        incremant_count(word_freqs_obj,w,i)
    },
    sorted: function () {
        let array:any=[]
        Object.keys(word_freqs_obj.freq).sort()
    .forEach(function (key) { array.push(`${key},${word_freqs_obj.freq[key]}`) });
     word_freqs_obj.array=array
    }

}
let x = data_storg_obj
x.init("inputFile.txt")
let y = stop_word_obj
y.init()
let z = word_freqs_obj
for (let i = 0; i < x.data.length; i++){
    let s = x.data[i].split(" ")
    for (let j = 0; j < s.length-1; j++){
        if (!(y.is_stop_word(s[j]))) {
            z.incremnt_count(s[j],i)
        }
        else {
            
        }
    }
}

z.sorted()
let word_freq =z.array 
for (let i = 0; i < 25; i++){
    console.log(word_freq[i].split(",")[0]+":"+word_freq[i].split(",")[2])
}
