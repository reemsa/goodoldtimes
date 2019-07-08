//different task
const fs = require('fs')
function frequencies_imp(word_list) {
    let  word_freqs = {}
    for (let i = 0; i < word_list.length; i++){
        if (word_freqs[word_list[i][0]] == undefined) {
            let line=String(Number(Math.floor(word_list[i][1] / 10) + 1))
            word_freqs[word_list[i][0]]=[1,line]
        }
        else {
            if (word_freqs[word_list[i][0]][1].split("-").indexOf(String(Number(Math.floor(word_list[i][1] / 10) + 1))) == -1) {
                word_freqs[word_list[i][0]][1]=word_freqs[word_list[i][0]][1]+"-"+String(Number(Math.floor(word_list[i][1] / 10) + 1))
            }
            word_freqs[word_list[i][0]][0]+=1 
        }
    }
    return word_freqs
}
function x(name) {
    /*here we do reflection for finding stop word but we can not do reflection
    for frequencies_imp function because it is hard to convert it to one line  */
    let stops=eval("fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(',')")
    let data=fs.readFileSync(name, 'utf8').replace(/[^A-Za-z0-9\n]+/g, ' ').toLowerCase().split("\n")
    let array = []
    for (let j = 0; j < data.length; j++){
         data[j]=data[j].split(' ')
        for (let i = 0; i < data[j].length; i++){
            if (stops.indexOf(data[j][i] as never) == -1) {
                array.push([data[j][i],j]) 
            }
        }  
    }
    
    return array
}
function sorted(word_freqs) {
    let array:any=[]
    Object.keys(word_freqs).sort().forEach(function (key) { array.push(`${key},${word_freqs[key]}`) });
    return array
}
let name2 = 'inputFile.txt'
let extract_words_func = "x(name2)"
let frequencies_func = "frequencies_imp(eval(extract_words_func))"
let  sort_func="sorted(eval(frequencies_func))"
let r = eval(sort_func)
for (let i = 1; i < r.length; i++){
    console.log("top25 ="+r[i].split(",")[0]+":"+r[i].split(",")[2])
}

