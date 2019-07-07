//different task
const fs = require('fs')
//The "I'll call you back" Word Frequency Framework
class WordFrequencyFramework{
    _load_event_handlers = []
    _dowork_event_handlers = []
    _end_event_handlers = []
    register_for_load_event( handler) {
       this._load_event_handlers.push(handler) 
    }
    register_for_dowork_event(handler) {
        this._dowork_event_handlers.push(handler)
    }
    register_for_end_event(handler) {
        this._end_event_handlers.push(handler)
    }
    run(path_to_file) {
        for (let i = this._load_event_handlers.length-1; i >=0; i--){
            //this._load_event_handlers[i].call(DataStorage,(path_to_file));
            this._load_event_handlers[i](path_to_file)
        }
        for (let i = 0; i < this._dowork_event_handlers.length; i++){
            //this._dowork_event_handlers[i].call(DataStorage);
            this._dowork_event_handlers[i]()
        }
        for (let i = 0; i < this._end_event_handlers.length; i++){
            //this._end_event_handlers[i].call(WordFrequencyCounter);
            this._end_event_handlers[i]()
        }
    }
}
//The entities of the application
class DataStorage{
    static _stop_word_filter: any;
    static _word_event_handlers: any=[];
    static _data: any;
    constructor( wfapp, stop_word_filter) {
        DataStorage._stop_word_filter = stop_word_filter
        wfapp.register_for_load_event(this.__load)
        wfapp.register_for_dowork_event(this.__produce_words)
    }
    __load(path_to_file) {
        DataStorage._data=fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase() 
    }
    __produce_words() {
        let data_str = DataStorage._data.split('\n')
        for (let w = 0; w < data_str.length; w++){
            data_str[w]=data_str[w].split(' ')
            for (let j = 0; j < data_str[w].length;j++)
            if (!DataStorage._stop_word_filter.is_stop_word(data_str[w][j])) {
                for (let h = 0; h < DataStorage._word_event_handlers.length; h++){
                    DataStorage._word_event_handlers[h](data_str[w][j],w) 
                }
            }
        }  
    }
    register_for_word_event(handler) {
        DataStorage._word_event_handlers.push(handler)
    }
}
class StopWordFilter{
    _stop_words = []
    static _stop_words: any;
    constructor(wfapp) {
      wfapp.register_for_load_event(this.__load)  
    }
    __load(ignore) {
        StopWordFilter._stop_words=fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')  
    }
    is_stop_word(word) {
        if (word.trim() == '') {
            return true
        }
        if (StopWordFilter._stop_words.indexOf(word) == -1) {
          return false
        }  
        
        else {
            return true
        }
    }
}
class WordFrequencyCounter{
    static _word_freqs: any={};
    constructor(wfapp, data_storage) {
        data_storage.register_for_word_event(this.__increment_count)
        wfapp.register_for_end_event(this.__print_freqs)
    }
    __increment_count(word,i) {
        if (WordFrequencyCounter._word_freqs[word] == undefined) {
            WordFrequencyCounter._word_freqs[word] = [word,1,String(Number(Math.floor(i / 10) + 1))]
        }
        else {
            WordFrequencyCounter._word_freqs[word][1] += 1
            if (WordFrequencyCounter._word_freqs[word][2].split('-').indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
                WordFrequencyCounter._word_freqs[word][2] = WordFrequencyCounter._word_freqs[word][2]+"-"+String(Number(Math.floor(i / 10) + 1))
            }
        }
    }
    __print_freqs() {
        let data = WordFrequencyCounter._word_freqs
                let array:any=[]
                Object.keys(data).sort()
            .forEach(function (key) { array.push(`${data[key]}`) });
        for (let i = 0; i < array.length; i++){
            //if freq larger then 25 ignore it in task ask if freq larger than 100 but here i am using 25 
            if (array[i].split(",")[1] < 25) {
                console.log("word = "+array[i].split(',')[0]+":"+array[i].split(',')[2])
                }
                
            }
    }
  
}
//The main function
let wfapp = new WordFrequencyFramework()
let stop_word_filter = new StopWordFilter(wfapp)
let data_storage = new DataStorage(wfapp, stop_word_filter)
let word_freq_counter =new WordFrequencyCounter(wfapp, data_storage)
wfapp.run("inputFile.txt")