import 'rxjs/add/operator/map'
import { map } from 'rxjs-compat/operator/map';
const fs = require("fs")//file-system module
function* partition(data_str, nlines) {
    let lines: any[] = data_str.split('\n');
    let lineswithnum: any[] = []
    let x 
    for (let i = 0; i < lines.length; i++){
        lineswithnum[i] = lines[i].trim()+":"+ String(Number(Math.floor(i / 10) + 1))
    }
    for (let i = 0; i < lineswithnum.length; i += nlines){
         x =  lineswithnum.slice(i, i + nlines) +'\n'
            yield x  
    }
}
function split_words(data_str) {
    function _scan(str_data) {
      return str_data.toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" ")
    }
    function _remove_stop_words(word_list) {
        let arr:any[]=[]
        let stop_words:any[] = fs.readFileSync('stop_words.txt', 'utf8').split(',');
        for (let i = 0; i < word_list.length; i++){
            if (stop_words.indexOf(word_list[i]) == -1) {
                arr.push(word_list[i])
            }
        }
        return arr
    }
    let result: any = []
    data_str=data_str.split(",")
    for (let j = 0; j < data_str.length; j++){
        let line = data_str[j].split(":")[1]
        let data=data_str[j].split(":")[0]
        let words = _remove_stop_words(_scan(data))
    for (let k = 0; k < words.length; k++){
        result.push([words[k], 1, line]) 
    } 
    }
    return result
}
let mapping = {}
function read_file(path_to_file) {
    return fs.readFileSync(path_to_file, "utf8")
}
function sort(word_freq) {
    let array:any=[]
    let ww = {}
    let key=Object.keys(word_freq)
    for (let i = 0; i < Object.keys(word_freq).length; i++){
        //console.log(word_freq[key[i]][2])
        ww[word_freq[key[i]][0]] = [word_freq[key[i]][1],":", word_freq[key[i]][2]]
        //console.log( word_freq[key[i]][0]+":"+ ww[word_freq[key[i]][0]])
    }
    Object.keys(ww).sort().forEach(function (key) { array.push(`${key},${ww[key]}`) });
    return array
}
function regroup(pairs_list) {
    for (let p = 0; p < pairs_list.length; p++){
        for (let u = 0; u < pairs_list[p].length; u++){
            if (mapping[pairs_list[p][u][0]] == undefined) {
                mapping[pairs_list[p][u][0]] = [pairs_list[p][u]]
                //console.log( "und="+mapping[pairs_list[p][u][0]])
            }
            else {
                mapping[pairs_list[p][u][0]].push(pairs_list[p][u])
               // console.log( "def="+mapping[pairs_list[p][u][0]])
            }
        }
    }
    return mapping
}
function count_words(mapping) {
    let data1=mapping[0]
    function add(x, y) {
        return x + y
    }
    let freq: any = []
    let lines:any=[]
    for (let i = 0; i < mapping[1].length; i++){
        if (lines.indexOf(mapping[1][i][2].replace(/[\n]+/g, "")) == -1) {
            lines.push(mapping[1][i][2].replace(/[\n]+/g, ""))
        }
        freq.push(mapping[1][i][1])
    }
    let data2 = freq.reduce(add)
    return [data1,data2,lines]
}
let data =read_file("inputFile.txt")
let f = partition(data, 2)
let partitions:any=[]
while (true) {
   let x = f.next()
    if (x['done']) {
        break
    }
    partitions.push(x['value'])
    
}
let splits: any = partitions.map(split_words)
let split_per_word = regroup(splits)
let cv:any=[]
for (let i = 0; i < Object.keys(split_per_word).length; i++){
    cv.push([Object.keys(split_per_word)[i],split_per_word[Object.keys(split_per_word)[i]]])
}
// for (let i = 0; i < cv.length; i++){
//     console.log(cv[i][0])
// }
 let word_freq = sort(cv.map(count_words))
for (let i = 0; i < word_freq.length; i++){
    //console.log(word_freq[i])
    console.log("word=" + word_freq[i].split(",")[0]+ word_freq[i].split(":")[1]) 
}
