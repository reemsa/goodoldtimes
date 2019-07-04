const fs = require('fs')
function extract_word(obj, path_file) {
    let x = fs.readFileSync(path_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ') 
    obj.data = x;
}
function load_stop_word(obj) {

    let x = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',') 
    obj.stop_words=x
}
function incremant_count(obj, w) {
    if (obj.freq[w] == undefined) {
        obj.freq[w]=1
    }
    else {
        obj.freq[w]+=1
    }
    
}
let data_storg_obj ={
    data: [],
    init: function (path_file) {
     extract_word(this,path_file)   
    },
    words: function () {
        return this.data
    }
}

let stop_word_obj = {
    stop_words: [],
    init: function () {
        load_stop_word(this)
    },
    is_stop_word: function (word) {
        if (this.stop_words.indexOf(word) == -1) {
            return false
        }
        return true
    }
}

let word_freqs_obj = {
    freq: {},
    array:[],
    incremnt_count: function (w) {
        incremant_count(this,w)
    },
    sorted: function () {
        let data=this.freq
        let array:any=[]
        Object.keys(data).sort(function (a, b) { return data[b] - data[a] })
    .forEach(function (key) { array.push(`${key},${data[key]}`) });
     this.array=array
    }

}
let x = data_storg_obj
x.init("inputFile.txt")
let y = stop_word_obj
y.init()
let z=word_freqs_obj
for (let i = 0; i < x.data.length; i++){
    if (!(y.is_stop_word(x.data[i]))) {
        z.incremnt_count(x.data[i])
    }
}
z.sorted()
let word_freq =z.array 
for (let i = 0; i < 25; i++){
    console.log(word_freq[i])
}
