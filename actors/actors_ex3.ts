const fs=require("fs")//file-system module
const { Queue } = require('queue-typescript')
const isAlphaNumeric = (ch: string) => {
    if (ch==' ')return false;
    return ch.match(/^[a-z0-9]+$/i) !== null;
  }
class ActiveWFObject  {
    name 
    queue
    stopMe
    promise;
    constructor() {
        this.name = String(typeof (this))
        this.queue = new Queue()
        this.stopMe = false 
        this.run(this)       

    }
    run(x) {
           
            x.promise=new Promise(function(resolve,reject){
               var id=setInterval(()=>{
                let massage = x.queue.dequeue()
                if (massage !=undefined){
                    x.dispatch(massage);
                    if (massage[0] == 'die') {
                    resolve(123);
                    clearInterval(id);
                }
                } 
               }) 
            })
        
    }
}

function send(reciever, message) {
    reciever.queue.enqueue(message)
}


class DataStorageManager extends ActiveWFObject{
    data:string='';
    alp_numic;
  recipient;
  constructor() {
    super()
    this.alp_numic as alphnumic
  }
    dispatch(message):any{
        if (message[0]=='init')
            this.init(message[1],message[2])
        else if (message[0]=='send_word_freq')
            this.process_words(message[1]);
        else send (this.alp_numic,message)
    }
    init(file_path:string,an:alphnumic){
        this.data = fs.readFileSync(file_path, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split("\n")  
        this.alp_numic=an;
    }
    process_words(message):any{
        this.recipient=message;
        let words = this.data
        for (let i = 0; i < words.length; i++){
            for (let j = 0; j < words[i].length; j++){
                if (i == words.length - 1 && j == words[i].length - 1) {
                    send (this.alp_numic,['is_alphnum',"hi",this.recipient]) 
                }
                else {
                    send (this.alp_numic,['is_alphnum',words[i][j],this.recipient])  
                }
            }
        }
        send(this.alp_numic,['filter',this.recipient])
    }
}
class alphnumic extends ActiveWFObject{
    data:string='';
    stop_word_manager;
    recipient;
    start_char = true
    word = ""
    constructor() {
    super()
    this.stop_word_manager as StopWordManager
    }
    dispatch(message): any{
        if (message[0]=='init')
        this.init(message[1])
        else if (message[0]=='is_alphnum')
            this.process_words(message[1],message[2]);
        else send (this.stop_word_manager,message)
    }
    init(swm:StopWordManager){ 
        this.stop_word_manager=swm;
    }
    process_words(message,wfc:WordFrequencyController):any{
        this.recipient = wfc;
        if (message == "hi") {
            send(this.stop_word_manager,['top25',this.recipient]) 
        }
        if (this.start_char == true) {
            if (isAlphaNumeric(message)) {
                this.word =message
                this.start_char=false
            }
        }
        else {
            if (isAlphaNumeric(message)) {
                this.word += message
            }
            else {
                this.start_char = true
                send (this.stop_word_manager,['filter',this.word])
            }
        }      
        
    }
}

class StopWordManager extends ActiveWFObject{
    stop_words:any[];
  word_freq_manager;
  constructor() {
    super()
    this.word_freq_manager as WordFrequencyManager
    this.stop_words=[]
  }
    dispatch(message){
        if (message[0]=='init')
            this.init(message[1])
        else if (message[0]=='filter')
            return this.filter(message[1]);
        else send(this.word_freq_manager,message);
    }
    init(m:WordFrequencyManager){
        this.stop_words=fs.readFileSync('stop_words.txt','utf8').split(",");
        this.word_freq_manager=m;
    }
    filter(word:string){
        if (this.stop_words.indexOf(word) == -1) {
            send(this.word_freq_manager,['word',word])
        }
    }
}

class WordFrequencyManager extends ActiveWFObject{
    word_freq:{}={};
  sorted: any[];
  constructor() {
    super()
    this.sorted=[]
  }
    dispatch(message){
        if (message[0]=='word')
            this.increment_count(message[1])
        else if (message[0]=='top25')
            this.top25(message[1]);
    }
    increment_count(word){
        if (this.word_freq[word]!=undefined){
            this.word_freq[word] += 1
        }
        else {
            this.word_freq[word] = 1
        }
    }
    top25(re) {
    let data=this.word_freq
    let array:any=[]
    Object.keys(data).sort(function (a, b) { return data[b] - data[a] })
        .forEach(function (key) { array.push(`${key},${data[key]}`) });
        send(re,['top25',array])
    }
}

class WordFrequencyController extends ActiveWFObject{
  storage_m;
  constructor() {
    super()
    this.storage_m as DataStorageManager
  }
    dispatch(message){
        if (message[0]=='top25')
            this.display(message[1])
        else if (message[0]=='run')
            this._run(message[1]);
    }
    display(wf){
        for (let i=0;i<25;i++){
            console.log("top25="+wf[i])
        }
        send(this.storage_m,['die'])
        send(this,['die'])
    }
    _run(m){
        this.storage_m=m;
        send(this.storage_m,['send_word_freq',this])
    }
}

//main 
let word_freq_manager = new WordFrequencyManager();
let alph_numic = new alphnumic();
let stop_word_manager = new StopWordManager();
send(alph_numic,['init',stop_word_manager])
send(stop_word_manager,['init',word_freq_manager])

let storage_manager=new DataStorageManager()
send(storage_manager,['init',"inputFile.txt",alph_numic])

let wfController=new WordFrequencyController()
send(wfController,['run',storage_manager])

let arr=[word_freq_manager.promise,alph_numic.promise,stop_word_manager.promise,storage_manager.promise,wfController.promise]
Promise.all(arr)