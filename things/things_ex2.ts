const fs = require('fs')
const sw = require('stopword')
class TFexercies{
    comp
    constructor() {
        this.comp = this.constructor;  
    }    
    info() {
        return this.comp.name
    }
}
class DataStorageManager extends TFexercies {
    input_file
    constructor(name) {
        super();
        this.input_file=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase()
    }
   
    info() {
        let comp:any = this.constructor;
        return "super class name="+super.info.call(new TFexercies())+" My DataStorageManager"+":"+comp.name
    }
}

class StopWordManager extends TFexercies {
    constructor(){
        super();
    }

    info() {
        let comp:any = this.constructor;
        return "super class name="+super.info.call(new TFexercies())+" My StopWordManager"+":"+comp.name
    }
}

class WordFrequencyManager extends TFexercies {

    constructor() {
        super();
    }
    info() {
        let comp:any = this.constructor;
        return "super class name="+super.info.call(new TFexercies())+" My WordFrequencyManager"+":"+comp.name
    }

}

class WordFrequencyController extends TFexercies {
    storagemanager
    stopmanager
    wordfreqmanager
    constructor(name) {
        super();
        this.storagemanager = new DataStorageManager(name);
        this.stopmanager = new StopWordManager();
        this.wordfreqmanager = new WordFrequencyManager();
        console.log(this.stopmanager.info())
        console.log(this.storagemanager.info())
        console.log(this.wordfreqmanager.info())
    }
}
let d=new WordFrequencyController("inputFile.txt")

