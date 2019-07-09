const fs = require('fs')
const sw = require('stopword')
class DataStorageManager {
    input_file
    constructor(name) {
        this.input_file = fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase()
    }
    word() {
        return this.input_file.split(' ')
    }
}

class StopWordManager {
    stop_word_list
    constructor(){
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
    static storagemanager
    static stopmanager
    static wordfreqmanager
    constructor(name) {
        console.log("inside constrator")
        DataStorageManager.prototype.constructor = profile(DataStorageManager.prototype.constructor)
        DataStorageManager.prototype.constructor(name)
        WordFrequencyController.storagemanager = new DataStorageManager(name) ;
        WordFrequencyController.stopmanager = new StopWordManager();
        WordFrequencyController.wordfreqmanager = new WordFrequencyManager();
    }
    run() {
        let t = WordFrequencyController.storagemanager.word()
        for (let i = 0; i < t.length; i++){
            if (!WordFrequencyController.stopmanager.is_stop_word(t[i])) {
                WordFrequencyController.wordfreqmanager.increment_count(t[i])
            }
        }
        let wordfreq = WordFrequencyController.wordfreqmanager.sorted()
        for (let i = 0; i < wordfreq.length; i++){
            console.log("data = "+wordfreq[i])
        }
    }
}
function profile(f) {
    function profilewrapper(...arg) {
        console.log("inside profile")
        let start_time:number = Number(new Date().getMilliseconds());
        let ret_value = f(...arg);
        let end_time: number = Number(new Date().getMilliseconds());
        let elapsed:number = end_time-start_time
        console.log("function name = "+f.name+" and elapesd ="+elapsed)
        return ret_value
    }
    return profilewrapper
}

let d = new WordFrequencyController("inputFile.txt")
WordFrequencyController.prototype.run = profile(WordFrequencyController.prototype.run);
WordFrequencyController.prototype.run()

