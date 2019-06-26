"use strict";
exports.__esModule = true;
var fs = require('fs'); //used to open files
var lineReader = require('line-reader'); //used to read line by line of input file
var data = []; //here it is represent primary memory 
var count = [];
//this function is used to check type of each char (num,alph,others)
var isAlphaNumeric = function (ch) {
    if (ch == ' ')
        return false;
    return ch.match(/^[a-z0-9]+$/i) !== null;
};
//this function is used to initilize data[] and open require file and read stoop_words file
function initilzation() {
    data[1] = ['']; // data[1] is line (max 80 characters)
    data[2] = ['none']; //data[2] is index of the start_char of word
    data[3] = [0]; //data[3] is index on characters, i = 0
    data[4] = [false]; //data[4] is flag indicating if word was found
    data[5] = ['']; //data[5] is the word
    data[6] = ['']; //data[6] is word,NNNN
    data[7] = [0]; // data[7] is frequency
    try {
        data[0] = fs.readFileSync('stop_words.txt', 'utf8').split(',');
        //console.log(data[0])
        var w = data[0].indexOf("ruba");
        console.log("w=" + w);
    }
    catch (e) {
        // console.log('Error:', e.stack);
    }
    //Open the secondary memory
    var input = fs.open('word_freqs.txt', 'w+', function (err, fd) {
        if (err) {
            console.log("error is" + err);
        }
        else {
            return;
        }
    });
}
/*this function is called by stepzero() function to check if any word of inputfile already exist
in word_freq file or not to handle how this word is stored in word_freqs file*/
function stepone(data5) {
    console.log("inside stepone() function ");
    data[6] = count;
    if (count.length == 0) {
        count.push(data5 + ",1\n");
    }
    else {
        for (var i = 0; i < data[6].length; i++) {
            console.log(data[6][i]);
            data[7][0] = Number(data[6][i].split(',')[1]);
            data[5][0] = data[6][i].split(',')[0].trim();
            console.log(data[5][0]);
            console.log(data[7][0]);
            if (data5.trim() == data[5][0].trim()) {
                console.log("equal");
                data[7][0] += 1;
                data[4][0] = true;
                count[i] = data5 + "," + String(data[7][0]);
                console.log(data[6][i] + "=" + data[5][0] + "+" + data[7][0]);
                console.log("File  created!");
                break;
            }
            else {
                console.log("not equal");
            }
            if (i == data[6].length - 1) {
                console.log(data[6][i]);
                console.log(data[5][0] + " ," + data[7][0]);
                count.push(data5 + ",0");
                console.log("File  created!");
            }
        }
    }
}
function stepzero() {
    lineReader.eachLine('inputFile.txt', function (line, last) {
        console.log("file==" + fs.readFileSync('word_freqs.txt', 'utf8'));
        if (line) {
            data[1] = [line];
            console.log(data[1][0]);
            if (data[1][0][data[1][0].length - 1] != '\n') {
                data[1][0] = data[1][0] + '\n';
            }
            data[2] = ['none'];
            data[3] = [0];
            for (data[3][0] = 0; data[3][0] < data[1][0].length;) {
                console.log(data[1][0][data[3][0]]);
                if (data[2][0] === 'none') {
                    if (isAlphaNumeric(data[1][0][data[3][0]]))
                        data[2][0] = data[3][0];
                }
                else {
                    if (!isAlphaNumeric(data[1][0][data[3][0]])) {
                        data[4] = [false];
                        data[5][0] = data[1][0].substring(Number(data[2][0]), data[3][0] + 1).toLowerCase();
                        console.log(data[5][0]);
                        if (data[5][0].length >= 2 && (data[0].indexOf(data[5][0].trim()) == -1)) {
                            stepone(data[5][0]);
                            console.log('inside:)');
                            console.log(data[5][0]);
                        }
                        data[2][0] = 'none';
                    }
                }
                data[3][0] += 1;
                console.log(data[3][0]);
            }
        }
        if (last) {
            for (data[7][0] = 0; data[7][0] < count.length; data[7][0]++) {
                fs.appendFile('word_freqs.txt', count[data[7][0]] + "\n", function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File created!");
                });
            }
            parttwo();
        }
    });
}
function parttwo() {
    for (var i = 0; i < 25; i++) {
        data[i] = [''];
    }
    data[25] = ['']; //word,freq
    data[26] = [0]; //freq
    //data[7]=['']
    lineReader.eachLine('word_freqs.txt', function (line, last) {
        if (line) {
            data[25][0] = line;
            data[26][0] = Number(data[25][0].split(',')[1]);
            data[25][0] = data[25][0].split(',')[0];
            for (data[26][1] = 0; data[26][1] < 25; data[26][1]++) {
                if (data[data[26][1]][0] == '' || Number(data[data[26][1]][0][1].split(',')[1]) < data[26][0]) {
                    data[data[26][1]][0] = data[25][0] + "," + data[26][0];
                    break;
                }
            }
        }
        if (last) {
            for (data[3][0] = 0; data[3][0] < 25; data[3][0]++) {
                console.log("data=" + data[data[3][0]][0]);
            }
        }
    });
}
initilzation();
stepzero();
//
