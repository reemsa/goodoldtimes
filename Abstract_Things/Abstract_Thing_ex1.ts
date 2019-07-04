const fs = require('fs')
const sw = require('stopword')
abstract class IDataStorageManager{
   abstract word()
}
abstract class IStopWordManager{
    abstract is_stop_word(word):boolean
}
abstract class IWordFrequencyManager{
    abstract increment_count(word);
    abstract sorted()
}
class DataStorageManager extends IDataStorageManager {
    input_file
    constructor(name) {
        super()
        this.input_file=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase()
    }
    word() {
        return this.input_file.split(' ')
    }
}

class StopWordManager extends IStopWordManager {
    stop_word_list
    constructor() {
        super()
    this.stop_word_list=fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
    }
    is_stop_word(word):boolean {
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

class WordFrequencyManager extends IWordFrequencyManager {
    word_freq
    array
    constructor() {
        super()
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
