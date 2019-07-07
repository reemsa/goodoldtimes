const fs = require('fs')
class EventManager{
    static _subscriptions
    constructor() {
       EventManager._subscriptions={} 
    }
    subscribe(event_type, handler) {
        if (EventManager._subscriptions[event_type] == undefined) {
           EventManager._subscriptions[event_type] = [handler] 
        }
        else {
            EventManager._subscriptions[event_type].push(handler)
        }
    }
    publish(event) {
        let event_type = event[0]
        if (EventManager._subscriptions[event_type] != undefined) {
            for (let i = 0; i < EventManager._subscriptions[event_type].length; i++){
                EventManager._subscriptions[event_type][i](event)
            }
        }
    }
}
//The entities of the application
class DataStorage{
    static _event_manager: EventManager;
    static _data: any;
    constructor( event_manager) {
        DataStorage._event_manager =event_manager
        DataStorage._event_manager.subscribe('load', this.load)
        DataStorage._event_manager.subscribe('start', this.produce_words)
    }
    load(event) {
        let path_to_file = event[1]
        DataStorage._data=fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase() 
    }
    produce_words(event) {

        let data_str = DataStorage._data.split('\n')
        for (let i = 0; i < data_str.length; i++){
            data_str[i] = data_str[i].split(" ")
            for (let w = 0; w < data_str.length; w++){
                if (data_str[i][w] != undefined) {
                    DataStorage._event_manager.publish(['word',data_str[i][w],i])
                }               
               }
        }
       
        DataStorage._event_manager.publish(['eof',null])
    }
}
class StopWordFilter{
    static _stop_words: any;
    static _event_manager:EventManager;
    constructor( event_manager) {
        StopWordFilter._stop_words = []
        StopWordFilter._event_manager = event_manager
        StopWordFilter._event_manager.subscribe('load',this.load)
        StopWordFilter._event_manager.subscribe('word',this.is_stop_word)
    }
    load(ignore) {
        StopWordFilter._stop_words=fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')  
    }
    is_stop_word(event) {
        let word = event[1]
        let i = event[2]
        if ((StopWordFilter._stop_words.indexOf(word) == -1) &&(word.trim()!='')) {
          StopWordFilter._event_manager.publish(['valid_word',word,i])
        }  
    }
}
class WordFrequencyCounter {
    static _word_freqs;
    static _event_manager: EventManager;
    constructor(event_manager) {
        WordFrequencyCounter._event_manager = event_manager
        WordFrequencyCounter._word_freqs = {}
        WordFrequencyCounter._event_manager.subscribe('valid_word', this.increment_count)
        WordFrequencyCounter._event_manager.subscribe('print', this.print_freqs)
    }
    increment_count(event) {
        let word = event[1]
        let i=event[2]
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
    print_freqs(event) {
        let data = WordFrequencyCounter._word_freqs
        let array: any = []
        Object.keys(data).sort()
            .forEach(function (key) { array.push(`${data[key]}`) });
        for (let i = 0; i < array.length; i++) {
            if (array[i].split(",")[1] < 25) {
                console.log("word = "+array[i].split(',')[0]+":"+array[i].split(',')[2])
                }
        }
    }
  
}
class WordFrequencyApplication{
    static _event_manager:EventManager
    constructor(event_manager) {
        WordFrequencyApplication._event_manager = event_manager
        WordFrequencyApplication._event_manager.subscribe('run', this.run)
        WordFrequencyApplication._event_manager.subscribe('eof', this.stop)
    }
    run(event) {
        let path_to_file = event[1]
        WordFrequencyApplication._event_manager.publish(['load', path_to_file])
        WordFrequencyApplication._event_manager.publish(['start', null])
    }
    stop(event) {
        WordFrequencyApplication._event_manager.publish(['print', null])
    }
}
let em = new EventManager()
new StopWordFilter(em);
new DataStorage(em);
new WordFrequencyCounter(em);
new WordFrequencyApplication(em);
em.publish(['run', "inputFile.txt"]);