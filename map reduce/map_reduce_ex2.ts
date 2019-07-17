import 'rxjs/add/operator/map'
const fs = require("fs")//file-system module
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
function* split_words(data_str,num) {
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
    let x=0
    let words = _remove_stop_words(_scan(data_str))
    if (words.length < num) {
        return words
    }
    for (let i = 0; i < words.length; i++){
        result.push([words[i], 1])
        if (i == x + num || i == words.length - 1) {
            yield result
            result = []
            x=i
        }
    }
}
let mapping = {}
function count_words(pairs_list_1, pairs_list_2) {
    for (let i = 0; i < pairs_list_1.length; i++){
        if (mapping[pairs_list_1[i][0]] == undefined) {
            mapping[pairs_list_1[i][0]] = pairs_list_1[i][1] 
        }
        else {
            mapping[pairs_list_1[i][0]] +=  pairs_list_1[i][1]
        }
    }
    for (let j = 0; j < pairs_list_2.length; j++){
        if (mapping[pairs_list_2[j][0]] == undefined) {
            mapping[pairs_list_2[j][0]] = pairs_list_2[j][1]
        }
        else {
            mapping[pairs_list_2[j][0]] += pairs_list_2[j][1]
        }
    }
    return mapping
}
function read_file(path_to_file) {
    return fs.readFileSync(path_to_file, "utf8")
}
function sort(word_freq) {
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] }).forEach(function(key) { array.push(`${key},${word_freq[key]}`)});
    return array
}
function bet(data_str) {
    let s = split_words(data_str, 3)
    let partitions: any = []
    while (true) {
        let x = s.next()
         if (x['done']) {
             break
        }
        for (let i = 0; i < x['value'].length; i++){
            partitions.push(x['value'][i])
        }   
    }
    return partitions
}

let data =read_file("inputFile.txt")
let f = partition(data, 4)
let partitions:any=[]
while (true) {
   let x = f.next()
    if (x['done']) {
        break
    }
    partitions.push(x['value'])
    
}
let splits: any = partitions.map(bet)
let word_freq = sort(splits.reduce(count_words))
for (let i = 0; i < 26; i++){
    if (word_freq[i].split(",")[0] == ""){}
    else { console.log("top25=" + word_freq[i]) }
}
