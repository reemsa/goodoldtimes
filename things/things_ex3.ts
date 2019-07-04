const fs = require('fs')
const sw = require('stopword')
class DataStorageManager {
    input_file
    constructor(name) {
        this.input_file=sw.removeStopwords(fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase().split(' '))
    }
    word() {
        return this.input_file
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
    storagemanager
    wordfreqmanager
    constructor(name) {
        this.storagemanager = new DataStorageManager(name);
        this.wordfreqmanager = new WordFrequencyManager();
    }
    run() {
        let t = this.storagemanager.word()
        for (let i = 0; i < t.length; i++){
                this.wordfreqmanager.increment_count(t[i])
        }
        let wordfreq = this.wordfreqmanager.sorted()
        for (let i = 0; i < wordfreq.length; i++){
            console.log("data = "+wordfreq[i])
        }
    }
}
let d=new WordFrequencyController("inputFile.txt")
d.run()
