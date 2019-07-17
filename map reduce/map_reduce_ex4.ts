import 'rxjs/add/operator/map'
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
function count_words(pairs_list_1, pairs_list_2) {
     //console.log("p1="+pairs_list_1)
     //console.log("p2="+pairs_list_2)
    for (let i = 0; i < pairs_list_1.length; i++){
        pairs_list_1[i][2]=pairs_list_1[i][2].replace(/[\n]+/g, "")
    //if(pairs_list_1[i][0]=="character"){console.log(pairs_list_1[i])}
        if (mapping[pairs_list_1[i][0]] == undefined) {
            mapping[pairs_list_1[i][0]] = [pairs_list_1[i][1],pairs_list_1[i][2]] 
            //console.log("if="+pairs_list_1[i][0]+":"+mapping[pairs_list_1[i][0]])
        }
        else {
            mapping[pairs_list_1[i][0]][0] += pairs_list_1[i][1]
            if (mapping[pairs_list_1[i][0]][1].split("-").indexOf(pairs_list_1[i][2]) == -1) {
                mapping[pairs_list_1[i][0]][1]+="-"+pairs_list_1[i][2]
            }
            //console.log("else="+pairs_list_1[i][0]+":"+mapping[pairs_list_1[i][0]])
        }
    }
    for (let j = 0; j < pairs_list_2.length; j++){
        pairs_list_2[j][2]=pairs_list_2[j][2].replace(/[\n]+/g, "")
       // if(pairs_list_2[j][0]=="character"){console.log(pairs_list_2[j])}
        if (mapping[pairs_list_2[j][0]] == undefined) {
            mapping[pairs_list_2[j][0]] = [pairs_list_2[j][1],pairs_list_2[j][2]]
            //console.log("if2="+pairs_list_2[j][0]+":"+mapping[pairs_list_2[j][0]])
        }
        else {
            mapping[pairs_list_2[j][0]][0] += pairs_list_2[j][1]
            if (mapping[pairs_list_2[j][0]][1].split("-").indexOf(pairs_list_2[j][2]) == -1) {
                mapping[pairs_list_2[j][0]][1]+="-"+pairs_list_2[j][2]
            }
        }
    }
    return mapping
}
function read_file(path_to_file) {
    return fs.readFileSync(path_to_file, "utf8")
}
function sort(word_freq) {
    let array:any=[]
    Object.keys(word_freq).sort().forEach(function(key) { array.push(`${key},${word_freq[key]}`)});
    return array
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
let word_freq = sort(splits.reduce(count_words))
for (let i = 0; i < word_freq.length; i++){
    if (word_freq[i].split(",")[0] == ""){}
    else { console.log("word=" + word_freq[i].split(",")[0]+":"+ word_freq[i].split(",")[2]) }
}
