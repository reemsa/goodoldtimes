import { format } from "util"
import * as readline from 'readline';
const sw = require('stopword')
const fs = require("fs")//file-system module
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
class WordFrequenciesModel{
    static freqs = {}
    static stopwords
    static data
    constructor(path_to_file) {
        this.update(path_to_file)
    }
    update(path_to_file) {
        WordFrequenciesModel.freqs={}
        try
        {
            WordFrequenciesModel.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "))
        for (let i = 0; i < WordFrequenciesModel.data.length; i++){
            if (WordFrequenciesModel.freqs[WordFrequenciesModel.data[i]] == undefined) {
                WordFrequenciesModel.freqs[WordFrequenciesModel.data[i]] =1
            }
            else {
                WordFrequenciesModel.freqs[WordFrequenciesModel.data[i]] +=1
            }
            }
            }
        catch (error) {
            console.log("file not found")
            WordFrequenciesModel.freqs={}
        }   
    }
}

class WordFrequenciesView {
     model: any
    constructor(model) {
        this.model=model
    }
    render() {
        let data=WordFrequenciesModel.freqs
        let array:any=[]
        Object.keys(data).sort(function (a, b) { return data[b] - data[a] })
            .forEach(function (key) { array.push(`${key},${data[key]}`) });
        for (let i = 0; i < 25; i++){
            console.log("top25="+array[i])
        }
    }
}
class event_handler{
    //modelhandler: any = []
    controllerhandler: any = []
    viwehandler:any=[]
    // register_for_model(handler) {
    //     this.modelhandler.push(handler)
    //   }
    register_for_viwe(handler) {
         this.viwehandler.push(handler) 
    }
    register_for_controller(handler) {
        this.controllerhandler.push(handler)
      }
    run() {
        for (let i = 0; i < this.viwehandler.length; i++){
            this.viwehandler[i]()  
          }
        for (let i = 0; i < this.controllerhandler.length; i++){
           this.controllerhandler[i]() 
        }
      
    }
}
class WordFrequencyController {
   static model: any
   static viwe: any
    event_handler
    constructor(model,viwe,event) {
        WordFrequencyController.model = model
        WordFrequencyController.viwe = viwe
        this.event_handler = event as event_handler
        this.event_handler.register_for_viwe(WordFrequencyController.viwe.render)
        this.event_handler.register_for_controller(this.run)
        //this.viwe.render()
    }
  
    run() {
        recursiveAsyncReadLine(WordFrequencyController.model,WordFrequencyController.viwe)
    }
}
var recursiveAsyncReadLine = function (m:WordFrequenciesModel,v:WordFrequenciesView) {
    rl.question('Next File: ', function (answer) {
      if (answer == 'exit') //we need some base case, for recursion
        return rl.close(); //closing RL and returning from function.
      m.update(answer);
      v.render()
      recursiveAsyncReadLine(m,v); //Calling this function again to ask new question
    });
};
let e = new event_handler();
let m = new WordFrequenciesModel("inputFile.txt")
let v = new WordFrequenciesView(m)
let c = new WordFrequencyController(m,v,e)

e.run()