import { format } from "util"
import * as readline from 'readline';
import { resolve } from "path";
const inquirer = require('inquirer')
const sw = require('stopword')
const fs = require("fs")//file-system module
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var questions = [{
    type: 'input',
    name: 'name',
    message: "more? [y/n] ",
}]
var questions2 = [{
    type: 'input',
    name: 'name',
    message: "next file: ",
  }]
class WordFrequenciesModel{
    freqs = {}
    freqsmall={}
    stopwords
    path_to_file
    data
    counter
    end
    constructor(path_to_file) {
        this.end=false
        this.path_to_file = path_to_file
        this.counter=0
        this.update(path_to_file)
    }
    update(path_to_file) {
        this.freqsmall = {}
        this.end=false
        try
        {

        this.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "))
            for (let i = this.counter; i < this.data.length; i++){
                if (i == this.data.length - 1) {
                    this.end = true
                    this.counter = 0                    
                }
                if (i == 10 + this.counter) {
                    this.counter += 10     
                  return 
                }
            if (this.freqs[this.data[i]] == undefined) {
                this.freqs[this.data[i]] = 1
                this.freqsmall[this.data[i]] =1
            }
            else {
                this.freqs[this.data[i]] += 1
                this.freqsmall[this.data[i]] =this.freqs[this.data[i]]
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
        Object.keys(data).sort(function (a, b) { return data[b] - data[a] })
            .forEach(function (key) { array.push(`${key},${data[key]}`) });
        for (let i = 0; i < 10; i++){
            console.log("top10="+array[i])
        }
        this.model.freqs={}
    }
} class WordFrequencyController {
    model: any
    viwe: any
    constructor(model,viwe) {
        this.model = model
        this.viwe = viwe
        let v = this.viwe
        let m = this.model
        for (let i = 0; i < Object.keys(m.freqsmall).length; i++){
            console.log(Object.keys(m.freqsmall)[i]+m.freqsmall[Object.keys(m.freqsmall)[i]])
        }
        this.k(m,v)
     
        // rl.question('more? [y/n] ', (answer) => {
        //     switch(answer.toLowerCase()) {
        //         case 'y':
        //             if (m.end == false) {
        //                 m.update(m.path_to_file)
        //                 askfunction(m, v)
        //             }
        //             else {
        //                 console.log("done")
        //                 m.end=false
        //                 v.render()
        //             }
        //             break;
        //         case 'n':
        //             m.end = true;
        //             rl.close();
        //             this.run()
        //             break;
        //         default:
        //             rl.close();
        //             this.run()
        //             console.log('Invalid answer!');
        //     }

        //   }); 
    }
     k(m,v) {
        inquirer.prompt(questions).then(answers => {
            if (answers['name'] == 'y') {
                if (m.end == false) {
                    m.update(m.path_to_file)
                    for (let i = 0; i < Object.keys(m.freqsmall).length; i++){
                        console.log(Object.keys(m.freqsmall)[i]+":"+m.freqsmall[Object.keys(m.freqsmall)[i]])
                    }
                    this.k(m,v)
                }
                else {
                    console.log("done")
                    m.end = false
                    v.render()
                    m.freqs={}
                    //recursiveAsyncReadLine(this.model,this.viwe)
                    this.k2(m,v)
                }
            }
            else if (answers['name'] == 'n') {
                m.end = true;
                v.render()
                this.k2(m,v)
                //rl.close();
                //this.run()
            }
            else {
              console.log('your answer should be y or n')
          }
          }) 
  }
  k2(m,v) {
    inquirer.prompt(questions2).then(answers => {
        if (answers['name'] != 'exit') {
            m.update(answers['name']);
            for (let i = 0; i < Object.keys(m.freqsmall).length; i++){
                console.log(Object.keys(m.freqsmall)[i]+m.freqsmall[Object.keys(m.freqsmall)[i]])
            }
            this.k(m, v)
           // this.k2(m,v)
            
        }
        else {
          console.log('the project is termmined')
      }
      }) 
}
    run() {
        this.k2(this.model,this.viwe)
    }
}
let m = new WordFrequenciesModel("inputFile.txt")
let v = new WordFrequenciesView(m)
let c = new WordFrequencyController(m, v)