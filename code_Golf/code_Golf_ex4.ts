const fs = require('fs')
const sw = require('stopword')
const array = []
//this instruction read file and replace non alpnum char with space then it is remove stop word 
let input_file = sw.removeStopwords(fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')) 
//this instruction used to find freq of word and return an object each value=word:freq
let i = input_file.reduce((r: any, k: any) => { r[k] = 1 + r[k] || 1; return r }, {})
//this instuction used to sort i object alph
let x= Object.keys(i).sort().forEach(function(key) { array.push(`${key},${i[key]}`)});
let ff = sw.removeStopwords(fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").replace(/[\n]+/g, ".").toLowerCase().split(' ')).join(' ').split('.')
for (let l = 0; l < ff.length; l++) {
    ff[l]=ff[l].split(' ')
    for (let r = 0; r < ff[l] .length; r++){
        for (let j = 0; j < array.length; j++){
            if (ff[l][r].trim() == array[j].split(',')[0]) {
                if (array[j].split(',')[2] == undefined) {
                    let page_no = Number(Math.floor(l/ 10) + 1)
                    let page_no_st = String(page_no)
                    array[j] = array[j] + "," + page_no_st                  
                }  
                else {
                    if (array[j].split(',')[2].split('.').indexOf(String(Number(Math.floor(l / 10) + 1)))==-1) {
                        let page_no = Number(Math.floor(l / 10) + 1)
                        let page_no_st=String(page_no)
                        array[j] = array[j] + "." + page_no_st 
                    }
                } 
                break
            }
        }
    }
  
}

for (let o = 0; o < array.length; o++){
    if (Number(array[o].split(',')[1]) < 20) {
        console.log(`word[${o+1}]=`+array[o].split(',')[0]+"-"+array[o].split(',')[2])
    }
    
}