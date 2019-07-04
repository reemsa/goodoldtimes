const fs = require('fs')
const sw = require('stopword')
class DataStorageManager {
    input_file
    dispatch(massage:any[]) {
        if (massage[0] == "init") {
            return this.init(massage[1])
        }
        if (massage[0] == "word") {
            return this.word()
        }
        else {
            throw new Error("massage invalid");
            
        }
    }
    init(name) {
        this.input_file=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9\n]+/g," ").toLowerCase()
    }
    word() {
        return this.input_file.split('\n')
    }
}

class StopWordManager {
    dispatch(massage:any[]) {
        if (massage[0] == "is_stop_word") {
            return this.remove_stop_word(massage[1])
        }
        else {
            throw new Error("massage invalid");
            
        }
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
    dispatch(massage:any[]) {
        if (massage[0] == "increment_count") {
            return this.increment_count(massage[1],massage[2])
        }
        if (massage[0] == "sorted") {
            return this.sorted()
        }
        else {
            throw new Error("massage invalid");
            
        }
    }
    increment_count(word, i) {   
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
    dispatch(massage:any[]) {
        if (massage[0] == "init") {
            return this.init(massage[1])
        }
        if (massage[0] == "run") {
            return this.run()
        }
        else {
            throw new Error("massage invalid");
            
        }
    }
    init(file_path) {
        this.storagemanager = new DataStorageManager()
        this.stopmanager = new StopWordManager()
        this.wordfreqmanager = new WordFrequencyManager()
        this.storagemanager.dispatch(["init",file_path])
    }
    run() {
        let t = this.storagemanager.dispatch(["word"])
        let word_list = this.stopmanager.dispatch(["is_stop_word",t])
        for (let i = 0; i < word_list.length; i++){
            for (let j = 0; j < word_list[i].length; j++){
                if (word_list[i][j] != '') {
                    this.wordfreqmanager.dispatch(["increment_count",word_list[i][j],i])
                    
                }   
            }
        }
        let wordfreq = this.wordfreqmanager.dispatch(["sorted"])
        for (let i = 0; i < wordfreq.length; i++){
            console.log("word = "+wordfreq[i].split(",")[0]+":"+wordfreq[i].split(",")[3])
        }
    }
}
let x = new WordFrequencyController();
x.dispatch(["init", "inputFile.txt"])
x.dispatch(["run"])
