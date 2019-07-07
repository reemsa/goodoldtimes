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
        DataStorage._data=fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase() 
    }
    produce_words(event) {

        let data_str = DataStorage._data.split(' ')
        for (let w = 0; w < data_str.length; w++){
         DataStorage._event_manager.publish(['word',data_str[w]])
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
        if ((StopWordFilter._stop_words.indexOf(word) == -1) &&(word.trim()!='')) {
          StopWordFilter._event_manager.publish(['valid_word',word])
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
        if (WordFrequencyCounter._word_freqs[word] == undefined) {
            WordFrequencyCounter._word_freqs[word] = 1
        }
        else {
            WordFrequencyCounter._word_freqs[word] += 1
        }
    }
    print_freqs(event) {
        let data = WordFrequencyCounter._word_freqs
        let array: any = []
        Object.keys(data).sort(function (a, b) { return data[b] - data[a] })
            .forEach(function (key) { array.push(`${key},${data[key]}`) });
        for (let i = 0; i < 25; i++) {
            console.log("top25 = " + array[i])
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