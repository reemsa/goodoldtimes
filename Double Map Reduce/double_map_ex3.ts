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
    let ww = {}
    let array: any = []
    for (let i = 0; i < word_freq.length; i++) {
        let key=Object.keys(word_freq[i])
        for (let j = 0; j < key.length; j++) {
            ww[key[j]]=word_freq[i][key[j]]  
        }
    }
    Object.keys(ww).sort(function (a, b) { return ww[b] - ww[a] }).forEach(function (key) { array.push(`${key},${ww[key]}`) });
    return array
}
function regroup(pairs_list) {
    for (let p = 0; p < pairs_list.length; p++){
        for (let u = 0; u < pairs_list[p].length; u++){
            let ch=pairs_list[p][u][0]
            if (ch.charCodeAt(0)  > 96 && ch.charCodeAt(0)  < 102 ){
                if (mapping["a-e"]!=undefined) mapping["a-e"].push(pairs_list[p][u])
                else mapping["a-e"]=[pairs_list[p][u]]
            }
            else if(ch.charCodeAt(0)  > 101 && ch.charCodeAt(0)  < 107 ){
                if (mapping["f-j"]!=undefined) mapping["f-j"].push(pairs_list[p][u])
                else mapping["f-j"]=[pairs_list[p][u]]
            }
            else if(ch.charCodeAt(0)  > 106 && ch.charCodeAt(0)  < 112 ){
                if (mapping["k-o"]!=undefined) mapping["k-o"].push(pairs_list[p][u])
                else mapping["k-o"]=[pairs_list[p][u]]
            }
            else if(ch.charCodeAt(0)  > 111 && ch.charCodeAt(0)  < 117 ){
                if (mapping["p-t"]!=undefined) mapping["p-t"].push(pairs_list[p][u])
                else mapping["p-t"]=[pairs_list[p][u]]
            }
            else if(ch.charCodeAt(0)  > 116 && ch.charCodeAt(0)  < 123 ){
                if (mapping["u-z"]!=undefined) mapping["u-z"].push(pairs_list[p][u])
                else mapping["u-z"]=[pairs_list[p][u]]
            }
        }
    }
    return mapping
}
function count_words(mapping) {
    let data = mapping[1]
    let wordfreq={}
    for (let i = 0; i < data.length; i++){
        if (wordfreq[data[i][0]] == undefined) {
            wordfreq[data[i][0]]=data[i][1] 
        }
        else {
            wordfreq[data[i][0]]+=data[i][1] 
        }
    }
    return wordfreq
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
 let word_freq = sort(cv.map(count_words))
for (let i = 0; i < 26; i++){
    if (word_freq[i].split(",")[0] == ""){}
    else { console.log("top25=" + word_freq[i]) }
}
