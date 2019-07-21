"use strict";
exports.__esModule = true;
var readline = require("readline");
var sw = require('stopword');
var fs = require("fs"); //file-system module
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var WordFrequenciesModel = /** @class */ (function () {
    function WordFrequenciesModel(path_to_file) {
        this.freqs = {};
        this.update(path_to_file);
    }
    WordFrequenciesModel.prototype.update = function (path_to_file) {
        try {
            this.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "));
            for (var i = 0; i < this.data.length; i++) {
                if (this.freqs[this.data[i]] == undefined) {
                    this.freqs[this.data[i]] = 1;
                }
                else {
                    this.freqs[this.data[i]] += 1;
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
        for (var i = 0; i < 25; i++) {
            console.log("top25=" + array[i]);
        }
    };
    return WordFrequenciesView;
}());
var WordFrequencyController = /** @class */ (function () {
    function WordFrequencyController(model, viwe) {
        this.model = model;
        this.viwe = viwe;
        this.viwe.render();
    }
    WordFrequencyController.prototype.run = function () {
        recursiveAsyncReadLine(this.model, this.viwe);
    };
    return WordFrequencyController;
}());
var recursiveAsyncReadLine = function (m, v) {
    rl.question('Next File: ', function (answer) {
        if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        m.update(answer);
        v.render();
        recursiveAsyncReadLine(m, v); //Calling this function again to ask new question
    });
};
var m = new WordFrequenciesModel("inputFile.txt");
var v = new WordFrequenciesView(m);
var c = new WordFrequencyController(m, v);
c.run();
