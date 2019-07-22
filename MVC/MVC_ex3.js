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
        this.update(path_to_file);
    }
    WordFrequenciesModel.prototype.update = function (path_to_file) {
        WordFrequenciesModel.freqs = {};
        try {
            WordFrequenciesModel.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "));
            for (var i = 0; i < WordFrequenciesModel.data.length; i++) {
                if (WordFrequenciesModel.freqs[WordFrequenciesModel.data[i]] == undefined) {
                    WordFrequenciesModel.freqs[WordFrequenciesModel.data[i]] = 1;
                }
                else {
                    WordFrequenciesModel.freqs[WordFrequenciesModel.data[i]] += 1;
                }
            }
        }
        catch (error) {
            console.log("file not found");
            WordFrequenciesModel.freqs = {};
        }
    };
    WordFrequenciesModel.freqs = {};
    return WordFrequenciesModel;
}());
var WordFrequenciesView = /** @class */ (function () {
    function WordFrequenciesView(model) {
        this.model = model;
    }
    WordFrequenciesView.prototype.render = function () {
        var data = WordFrequenciesModel.freqs;
        var array = [];
        Object.keys(data).sort(function (a, b) { return data[b] - data[a]; })
            .forEach(function (key) { array.push(key + "," + data[key]); });
        for (var i = 0; i < 25; i++) {
            console.log("top25=" + array[i]);
        }
    };
    return WordFrequenciesView;
}());
var event_handler = /** @class */ (function () {
    function event_handler() {
        //modelhandler: any = []
        this.controllerhandler = [];
        this.viwehandler = [];
    }
    // register_for_model(handler) {
    //     this.modelhandler.push(handler)
    //   }
    event_handler.prototype.register_for_viwe = function (handler) {
        this.viwehandler.push(handler);
    };
    event_handler.prototype.register_for_controller = function (handler) {
        this.controllerhandler.push(handler);
    };
    event_handler.prototype.run = function () {
        for (var i = 0; i < this.viwehandler.length; i++) {
            this.viwehandler[i]();
        }
        for (var i = 0; i < this.controllerhandler.length; i++) {
            this.controllerhandler[i]();
        }
    };
    return event_handler;
}());
var WordFrequencyController = /** @class */ (function () {
    function WordFrequencyController(model, viwe, event) {
        WordFrequencyController.model = model;
        WordFrequencyController.viwe = viwe;
        this.event_handler = event;
        this.event_handler.register_for_viwe(WordFrequencyController.viwe.render);
        this.event_handler.register_for_controller(this.run);
        //this.viwe.render()
    }
    WordFrequencyController.prototype.run = function () {
        recursiveAsyncReadLine(WordFrequencyController.model, WordFrequencyController.viwe);
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
var e = new event_handler();
var m = new WordFrequenciesModel("inputFile.txt");
var v = new WordFrequenciesView(m);
var c = new WordFrequencyController(m, v, e);
e.run();
