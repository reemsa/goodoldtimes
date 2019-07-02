var lineNumber = require('linenumber');
const fs = require('fs')
const sw = require('stopword')
const array = []
var fixture = fs.readFileSync('inputFile.txt', 'utf8').toLowerCase();
//this instruction read file and replace non alpnum char with space then it is remove stop word 
let input_file = sw.removeStopwords(fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')) 
//this instruction used to find freq of word and return an object each value=word:freq
let i = input_file.reduce((r: any, k: any) => { r[k] = 1 + r[k] || 1; return r }, {})
//this instuction used to sort i object alph
let x= Object.keys(i).sort().forEach(function(key) { array.push(`${key},${i[key]}`)});
for (let q = 0; q < array.length; q++){
    if (array[q].split(',')[0] != '') {
       var regex = new RegExp(array[q].split(',')[0].trim() , "g");
        let u = lineNumber(fixture, regex)  
        for (let l = 0; l < u.length; l++){
            if (array[q].split(',')[2] == undefined) {
                array[q] = array[q] + "," + String(Number(Math.floor(u[l].line/ 10) + 1))
            }
            else {
                if (array[q].split(',')[2].split('.').indexOf(String(Number(Math.floor( u[l].line/ 10) + 1)))==-1) {
                array[q] = array[q] + "." + String(Number(Math.floor(u[l].line/ 10) + 1))
                }
            } 
        }
    }
    
}

for (let o = 1; o < array.length; o++){
    if (Number(array[o].split(',')[1]) < 20) {
        console.log(`word[${o}]=`+array[o].split(',')[0]+"-"+array[o].split(',')[2])
    }
    
}