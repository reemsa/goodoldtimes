//in this exc there is no need for decorater because typescript is type base not as python which is typeless so just change type from any to specific type
const fs = require('fs')
const sw = require('stopword')
abstract class IDataStorageManager{
   abstract word()
}
abstract class IStopWordManager{
    abstract is_stop_word(word:string):boolean
}
abstract class IWordFrequencyManager{
    abstract increment_count(word:string);
    abstract sorted()
}
class DataStorageManager extends IDataStorageManager {
    input_file:string
    constructor(name:string) {
        super()
        this.input_file=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase()
    }
    word() {
        return this.input_file.split(' ')
    }
}

class StopWordManager extends IStopWordManager {
    stop_word_list:string[]
    constructor() {
        super()
    this.stop_word_list=fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
    }
    is_stop_word(word:string):boolean {
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
    array:string[]
    constructor() {
        super()
        this.word_freq = {} 
        this.array=[]  
    }
    increment_count(word:string) {
       
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
    storagemanager:DataStorageManager
    stopmanager:StopWordManager
    wordfreqmanager:WordFrequencyManager
    constructor(name) {
        this.storagemanager = new DataStorageManager(name);
        this.stopmanager = new StopWordManager();
        this.wordfreqmanager = new WordFrequencyManager();
    }
    run() {
        let t = this.storagemanager.word()
        for (let i:number = 0; i < t.length; i++){
            if (!this.stopmanager.is_stop_word(t[i])) {
                this.wordfreqmanager.increment_count(t[i])
            }
        }
        let wordfreq = this.wordfreqmanager.sorted()
        for (let i:number = 0; i < wordfreq.length; i++){
            console.log("data = "+wordfreq[i])
        }
    }
}
let d:WordFrequencyController=new WordFrequencyController("inputFile.txt")
d.run()
