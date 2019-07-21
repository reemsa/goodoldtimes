import { format } from "util"
import * as readline from 'readline';
const sw = require('stopword')
const fs = require("fs")//file-system module
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
class WordFrequenciesModel{
    freqs = {}
    stopwords
    data
    constructor(path_to_file) {
        this.update(path_to_file)
    }
    update(path_to_file) {
        this.freqs={}
        try
        {
        this.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9\n]+/g, " ").split("\n"))
            for (let i = 0; i < this.data.length; i++){
                this.data[i] = this.data[i].split(" ")
                for (let j = 0; j < this.data[i].length; j++){
                    if (this.freqs[this.data[i][j]] == undefined) {
                        this.freqs[this.data[i][j]] =[1,String(Number(Math.floor(i / 10) + 1))]
                    }
                    else {
                        this.freqs[this.data[i][j]][0] += 1
                        if (this.freqs[this.data[i][j]][1].split("-").indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
                            this.freqs[this.data[i][j]][1]+="-"+ String(Number(Math.floor(i / 10) + 1))
                        }
                    }
                }
          
            }
            }
        catch (error) {
            console.log("file not found")
            this.freqs={}
        }   
    }
}

class WordFrequenciesView {
    model: any
    constructor(model) {
        this.model=model
    }
    render() {
        let data=this.model.freqs
        let array:any=[]
        Object.keys(data).sort().forEach(function (key) { array.push(`${key},${data[key]}`) });
        for (let i = 0; i < array.length; i++){
            if (array[i].split(",")[1] < 100) {
                console.log("word="+array[i].split(",")[0]+":"+array[i].split(",")[2])  
            }
            console.log("word="+array[i])
        }
    }
} class WordFrequencyController {
    model: any
    viwe: any
    constructor(model,viwe) {
        this.model = model
        this.viwe = viwe
        this.viwe.render()
    }
    run() {
        recursiveAsyncReadLine(this.model,this.viwe)
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
let m = new WordFrequenciesModel("inputFile.txt")
let v = new WordFrequenciesView(m)
let c = new WordFrequencyController(m, v)
c.run()