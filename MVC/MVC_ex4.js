"use strict";
exports.__esModule = true;
var readline = require("readline");
var fs = require("fs");
var sw = require('stopword');
var _ = require("lodash");
var Queue = require('queue-typescript').Queue;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var queue = new Queue();
var FreqObserver = /** @class */ (function () {
    //static queue
    function FreqObserver(freqs) {
        this.freqs = {};
        this.freqs = freqs;
        //this.run(this)   
    }
    FreqObserver.prototype.run = function (x) {
        x.promise = new Promise(function (resolve, reject) {
            var id = setInterval(function () {
                var massage = queue.dequeue();
                if (massage != undefined) {
                    x.update(massage[1]);
                    if (massage[0] == 'die') {
                        resolve(123);
                        clearInterval(id);
                    }
                }
            });
        });
    };
    FreqObserver.prototype.update = function (freq_list) {
        var freqs_1 = [];
        Object.keys(freq_list).sort(function (a, b) { return freq_list[b] - freq_list[a]; })
            .forEach(function (key) { freqs_1.push(key + "," + freq_list[key]); });
        this.update_display(freqs_1);
        //let freqs_1 = _.fromPairs(_.sortBy(_.toPairs(_.countBy(freq_list)), 1).reverse())
        // if (!(_.isEqual(freqs_1,this.freqs))) {
        //     this.update_display(freqs_1)
        //     this.freqs=freqs_1
        //   }
    };
    FreqObserver.prototype.update_display = function (wf) {
        console.log("first ten words ");
        for (var i = 0; i < wf.length; i++) {
            console.log("top=" + wf[i]);
        }
        console.log();
    };
    return FreqObserver;
}());
var WordsCounter = /** @class */ (function () {
    function WordsCounter() {
        this.freqs = {};
        this.minfreqs = {};
    }
    WordsCounter.prototype.count = function (file_path) {
        var words = sw.removeStopwords(fs.readFileSync(file_path, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "));
        for (var i = 0; i < words.length; i++) {
            if (i == words.length - 1) {
                queue.enqueue(["add", this.freqs]);
                queue.enqueue(["die", this.freqs]);
                this.freqs = {};
            }
            if (i != 0 && i % 10 == 0) {
                queue.enqueue(["add", this.minfreqs]);
                this.minfreqs = {};
            }
            if (this.freqs[words[i]] != undefined) {
                this.freqs[words[i]] += 1;
            }
            else {
                this.freqs[words[i]] = 1;
            }
            this.minfreqs[words[i]] = this.freqs[words[i]];
        }
    };
    return WordsCounter;
}());
var recursiveAsyncReadLine = function (m, v) {
    rl.question('File name : ', function (answer) {
        if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        m.count(answer);
        v.run(v);
        recursiveAsyncReadLine(m, v); //Calling this function again to ask new question
    });
};
var model = new WordsCounter();
var view = new FreqObserver(model.freqs);
recursiveAsyncReadLine(model, view);
