import 'rxjs/add/operator/map'
const fs = require("fs")//file-system module
let mapping = {}
function* partition(data_str, nlines) {
    let lines: any[] = data_str.split('\n');
    if (lines.length < nlines) {
        return data_str
    }
    for (let i = 0; i < lines.length; i += nlines){
        if (lines.length < nlines + i) {
            return '\n' + lines.slice(i, lines.length)
        }
        let x = '\n' + lines.slice(i, i + nlines)
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
    let result :any= []
    let words = _remove_stop_words(_scan(data_str))
    for (let i = 0; i < words.length; i++){
        result.push([words[i],1])
    }
    return result
}
function read_file(path_to_file) {
    return fs.readFileSync(path_to_file, "utf8")
}
function sort(word_freq) {
    let array: any = []
    let ww = {}
    let key=Object.keys(word_freq)
    for (let i = 0; i < Object.keys(word_freq).length; i++){
        ww[word_freq[key[i]][0]]=word_freq[key[i]][1]
    }
    Object.keys(ww).sort(function (a, b) { return ww[b] - ww[a] }).forEach(function (key) { array.push(`${key},${ww[key]}`) });
    return array
}
function regroup(pairs_list) {
    for (let p = 0; p < pairs_list.length; p++){
        for (let u = 0; u < pairs_list[p].length; u++){
            if (mapping[pairs_list[p][u][0]] == undefined) {
                mapping[pairs_list[p][u][0]]=[pairs_list[p][u]]
            }
            else {
                mapping[pairs_list[p][u][0]].push(pairs_list[p][u])
            }
        }
    }
    return mapping
}
function count_words(mapping) {
    let data1 = mapping[0]
    let data2=mapping[1].length
    return [data1,data2]
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
for (let i = 1; i < Object.keys(split_per_word).length; i++){
    cv.push([Object.keys(split_per_word)[i],split_per_word[Object.keys(split_per_word)[i]]])
}
 let word_freq = sort(cv.map(count_words))
for (let i = 0; i < 26; i++){
    if (word_freq[i].split(",")[0] == ""){}
    else { console.log("top25=" + word_freq[i]) }
}
