const fs = require('fs')
const sw = require('stopword')
let mainarray=[]
function info(classname) {
    
console.log(classname.name)
let key = Object.keys(classname.prototype)
console.log(key)
}
class DataStorageManager {
    
    input_file
    constructor(name) {
        mainarray.push(DataStorageManager)
        this.input_file=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase()
    }
    word() {
        return this.input_file.split(' ')
    }
}

class StopWordManager {
    stop_word_list
    constructor() {
        mainarray.push(StopWordManager)
    this.stop_word_list=fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
    }
    is_stop_word(word) {
        if (word.trim() == '') {
            return true
        }
        if (this.stop_word_list.indexOf(word) == -1) {
          return false
        }  
        
        else {
            return true
        }
    }
}

class WordFrequencyManager {
    word_freq
    array
    constructor() {
        mainarray.push(WordFrequencyManager)
        this.word_freq = {} 
        this.array=[]  
    }
    increment_count(word) {
       
        if (this.word_freq[word] == undefined) {
            this.word_freq[word] = 1 
        }
        else {
            this.word_freq[word] += 1
        }
    }
    sorted() {
        let x = Object.keys(this.word_freq)
        let data = this.word_freq
                let array:any=[]
                Object.keys(data).sort(function (a, b) { return data[b] - data[a] })
            .forEach(function (key) { array.push(`${key},${data[key]}`) });
        return array
    }

}

class WordFrequencyController {
    storagemanager
    stopmanager
    wordfreqmanager
    constructor(name) {
        mainarray.push(WordFrequencyController)
        this.storagemanager = new DataStorageManager(name);
        this.stopmanager = new StopWordManager();
        this.wordfreqmanager = new WordFrequencyManager();
    }
    run() {
        let t = this.storagemanager.word()
        for (let i = 0; i < t.length; i++){
            if (!this.stopmanager.is_stop_word(t[i])) {
                this.wordfreqmanager.increment_count(t[i])
            }
        }
        let wordfreq = this.wordfreqmanager.sorted()
        for (let i = 0; i < wordfreq.length; i++){
            console.log("data = "+wordfreq[i])
        }
    }
}
let d=new WordFrequencyController("inputFile.txt")
d.run()
for (let i = 0; i < mainarray.length; i++){
    info(mainarray[i]) 
}
