"use strict";
exports.__esModule = true;
var readline = require("readline");
var inquirer = require('inquirer');
var sw = require('stopword');
var fs = require("fs"); //file-system module
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var questions = [{
        type: 'input',
        name: 'name',
        message: "more? [y/n] "
    }];
var questions2 = [{
        type: 'input',
        name: 'name',
        message: "next file: "
    }];
var WordFrequenciesModel = /** @class */ (function () {
    function WordFrequenciesModel(path_to_file) {
        this.freqs = {};
        this.freqsmall = {};
        this.end = false;
        this.path_to_file = path_to_file;
        this.counter = 0;
        this.update(path_to_file);
    }
    WordFrequenciesModel.prototype.update = function (path_to_file) {
        this.freqsmall = {};
        this.end = false;
        try {
            this.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "));
            for (var i = this.counter; i < this.data.length; i++) {
                if (i == this.data.length - 1) {
                    this.end = true;
                    this.counter = 0;
                }
                if (i == 10 + this.counter) {
                    this.counter += 10;
                    return;
                }
                if (this.freqs[this.data[i]] == undefined) {
                    this.freqs[this.data[i]] = 1;
                    this.freqsmall[this.data[i]] = 1;
                }
                else {
                    this.freqs[this.data[i]] += 1;
                    this.freqsmall[this.data[i]] = this.freqs[this.data[i]];
                }
            }
        }
        catch (error) {
            console.log("file not found");
            this.freqs = {};
        }
    };
    return WordFrequenciesModel;
}());
var WordFrequenciesView = /** @class */ (function () {
    function WordFrequenciesView(model) {
        this.model = model;
    }
    WordFrequenciesView.prototype.render = function () {
        var data = this.model.freqs;
        var array = [];
        Object.keys(data).sort(function (a, b) { return data[b] - data[a]; })
            .forEach(function (key) { array.push(key + "," + data[key]); });
        for (var i = 0; i < 10; i++) {
            console.log("top10=" + array[i]);
        }
        this.model.freqs = {};
    };
    return WordFrequenciesView;
}());
var WordFrequencyController = /** @class */ (function () {
    function WordFrequencyController(model, viwe) {
        this.model = model;
        this.viwe = viwe;
        var v = this.viwe;
        var m = this.model;
        for (var i = 0; i < Object.keys(m.freqsmall).length; i++) {
            console.log(Object.keys(m.freqsmall)[i] + m.freqsmall[Object.keys(m.freqsmall)[i]]);
        }
        this.k(m, v);
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
    WordFrequencyController.prototype.k = function (m, v) {
        var _this = this;
        inquirer.prompt(questions).then(function (answers) {
            if (answers['name'] == 'y') {
                if (m.end == false) {
                    m.update(m.path_to_file);
                    for (var i = 0; i < Object.keys(m.freqsmall).length; i++) {
                        console.log(Object.keys(m.freqsmall)[i] + ":" + m.freqsmall[Object.keys(m.freqsmall)[i]]);
                    }
                    _this.k(m, v);
                }
                else {
                    console.log("done");
                    m.end = false;
                    v.render();
                    m.freqs = {};
                    //recursiveAsyncReadLine(this.model,this.viwe)
                    _this.k2(m, v);
                }
            }
            else if (answers['name'] == 'n') {
                m.end = true;
                v.render();
                _this.k2(m, v);
                //rl.close();
                //this.run()
            }
            else {
                console.log('your answer should be y or n');
            }
        });
    };
    WordFrequencyController.prototype.k2 = function (m, v) {
        var _this = this;
        inquirer.prompt(questions2).then(function (answers) {
            if (answers['name'] != 'exit') {
                m.update(answers['name']);
                for (var i = 0; i < Object.keys(m.freqsmall).length; i++) {
                    console.log(Object.keys(m.freqsmall)[i] + m.freqsmall[Object.keys(m.freqsmall)[i]]);
                }
                _this.k(m, v);
                // this.k2(m,v)
            }
            else {
                console.log('the project is termmined');
            }
        });
    };
    WordFrequencyController.prototype.run = function () {
        this.k2(this.model, this.viwe);
    };
    return WordFrequencyController;
}());
// var recursiveAsyncReadLine = function (m: WordFrequenciesModel, v: WordFrequenciesView) {
//     console.log("inside rec")
//     rl.question('Next File: ', function (answer) {
//       if (answer == 'exit') //we need some base case, for recursion
//         return rl.close(); //closing RL and returning from function.
//         m.update(answer);
//         for (let i = 0; i < Object.keys(m.freqsmall).length; i++){
//             console.log(Object.keys(m.freqsmall)[i]+m.freqsmall[Object.keys(m.freqsmall)[i]])
//         }
//       askfunction(m,v)     
//       v.render()
//       recursiveAsyncReadLine(m,v); //Calling this function again to ask new question
//     });
// };
// var askfunction =  function (m: WordFrequenciesModel, v: WordFrequenciesView) {
//     for (let i = 0; i < Object.keys(m.freqsmall).length; i++){
//         console.log(Object.keys(m.freqsmall)[i]+":"+m.freqsmall[Object.keys(m.freqsmall)[i]])
//     }
//       rl.question('more? [y/n] ', (answer) => {
//             switch(answer.toLowerCase()) {
//                 case 'y':
//                     if (m.end == false) {
//                         m.update(m.path_to_file)
//                         askfunction(m, v)
//                     }
//                     else {
//                         console.log("done")
//                         //m.end=false
//                         v.render()
//                         return
//                     }
//                     break;
//                 case 'n':
//                     m.end = true;
//                     rl.close();
//                     break;
//                 default:
//                     rl.close();
//                     console.log('Invalid answer!');
//             }
//           });  
//   };
var m = new WordFrequenciesModel("inputFile.txt");
var v = new WordFrequenciesView(m);
var c = new WordFrequencyController(m, v);
//c.run()
