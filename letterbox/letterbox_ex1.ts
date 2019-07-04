const fs = require('fs')
class DataStoregManeger{
    data=""
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
    init(file_path) {
       this.data=fs.readFileSync(file_path, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase() 
    }
    word() {
        return this.data.split(" ")
    }

}
class StopWordManeger{
    stop_word_list
    dispatch(massage:any[]) {
        if (massage[0] == "init") {
            return this.init()
        }
        if (massage[0] == "is_stop_word") {
            return this.is_stop_word(massage[1])
        }
        else {
            throw new Error("massage invalid");
            
        }
    }
    init() {
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
class WordFrequencyManeger{
    word_freq={}
    dispatch(massage:any[]) {
        if (massage[0] == "increment_count") {
            return this.increment_count(massage[1])
        }
        if (massage[0] == "sorted") {
            return this.sorted()
        }
        else {
            throw new Error("massage invalid");
            
        }
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
class WordFrequencyController{
    datastoragemanager
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
        this.datastoragemanager = new DataStoregManeger()
        this.stopmanager = new StopWordManeger();
        this.wordfreqmanager = new WordFrequencyManeger();
        this.datastoragemanager.dispatch(["init",file_path])
        this.stopmanager.dispatch(["init"])
    }
    run() {
        let t = this.datastoragemanager.dispatch(["word"])
        for (let i = 0; i < t.length; i++){
            if (!this.stopmanager.dispatch(["is_stop_word",t[i]])) {
                this.wordfreqmanager.dispatch(["increment_count",t[i]])
            }
        }
        let wordfreq = this.wordfreqmanager.dispatch(["sorted"])
        for (let i = 0; i < wordfreq.length; i++){
            console.log("data = "+wordfreq[i])
        } 
    }
}
let x = new WordFrequencyController();
x.dispatch(["init", "inputFile.txt"])
x.dispatch(["run"])