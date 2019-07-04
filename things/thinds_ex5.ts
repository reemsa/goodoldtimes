const fs = require('fs')
const sw = require('stopword')
class DataStorageManager {
    input_file
    constructor(name) {
        this.input_file=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9\n]+/g," ").toLowerCase()
    }
    word() {
        return this.input_file.split('\n')
    }
}

class StopWordManager {
    constructor(){
    }
    remove_stop_word(word_list) {
        for (let i = 0; i < word_list.length; i++){
            word_list[i] = sw.removeStopwords(word_list[i].split(' ')) 
        }
        return word_list
    }
}

class WordFrequencyManager {
    word_freq
    array
    constructor() {
        this.word_freq = {} 
        this.array=[]  
    }
    increment_count(word,i) {       
        if (this.word_freq[word] == undefined) {
            this.word_freq[word] = [word,1,String(Number(Math.floor(i / 10) + 1))]
        }
        else {
            this.word_freq[word][1] += 1
            if (this.word_freq[word][2].split('-').indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
                this.word_freq[word][2] = this.word_freq[word][2]+"-"+String(Number(Math.floor(i / 10) + 1))
            }
        }
    }
    sorted() {
        let data = this.word_freq
                let array:any=[]
                Object.keys(data).sort().forEach(function (key) { array.push(`${key},${data[key]}`) });
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
        let word_list = this.stopmanager.remove_stop_word(t)
        for (let i = 0; i < word_list.length; i++){
            for (let j = 0; j < word_list[i].length; j++){
                if (word_list[i][j] != '') {
                    this.wordfreqmanager.increment_count(word_list[i][j],i)
                    
                }   
            }
        }
        let wordfreq = this.wordfreqmanager.sorted()
        for (let i = 0; i < wordfreq.length; i++){
            console.log("word = "+wordfreq[i].split(",")[0]+":"+wordfreq[i].split(",")[3])
        }
    }
}
let d=new WordFrequencyController("inputFile.txt")
d.run()
