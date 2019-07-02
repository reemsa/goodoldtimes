const fs = require('fs')
const sw = require('stopword')
const array=[]
//this instruction read file and replace non alpnum char with space then it is remove stop word 
let input_file:any =sw.removeStopwords(fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9]+/g," ").toLowerCase().split(' ')) 
//this instruction used to find freq of word and return an object each value=word:freq
let i = input_file.reduce((r: any, k: any) => { r[k] = 1 + r[k] || 1; return r }, {})
//this instuction used to sort i object alph
let x= Object.keys(i).sort(function (a, b) { return i[b] - i[a] }).forEach(function(key) { array.push(`${key},${i[key]}`)});
for (let o = 0; o < 25; o++){
    console.log(`word[${o+1}]=`+array[o])
}