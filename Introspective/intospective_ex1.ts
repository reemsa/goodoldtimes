var global = this
const fs = require('fs')
interface path_value{
value:string
}
interface word_list_value{
    value:any[]
}
interface word_freq_value{
    value:{}
}
interface array_value{
    value:any[]
}
function read_stop_word() {
    let x: string = read_stop_word.caller.toString()
    let v = x.split(" ")[1]
    let c:any[]=[];
    for (let i = 0; i < v.length; i++){
        if (v[i] == "(") {
            break
        }
        else {
           c[i]=v[i] 
        }
    }
    let k=c.join("")
    if (k != 'extract_words') {
        return null
    }
    else {
        let stop_words = fs.readFileSync("stop_words.txt", 'utf8').toLowerCase().split(',')
        return stop_words ;
    }

}
function extract_words(path_to_file: Readonly<path_value>) {
    let word_list=fs.readFileSync(path_to_file.value, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(" ")
    let stop_words: [] = read_stop_word()
    let array = []
    for (let i = 0; i < word_list.length; i++){
        if (stop_words.indexOf(word_list[i] as never) == -1) {
          array.push(word_list[i])  
        }
    }
    let x: word_list_value = {
        value:array
    }
    
    return x
}
function frequencies(word_list_array:Readonly<word_list_value>) {
    let word_freqs = {};
    let word_list=word_list_array.value
    for (let i = 0; i < word_list.length; i++){
        if (word_freqs[word_list[i]] == undefined) {
            word_freqs[word_list[i]]=1
        }
        else {
            word_freqs[word_list[i]]+=1 
        }
    }
    let w: word_freq_value = {
        value:word_freqs
    }
    return w;
}
function sort(word_freq_value: Readonly<word_freq_value>) {
    let word_freq=word_freq_value.value
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
        .forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
    let ar: array_value = {
        value: array
    }
    return ar
}
function main() {
    let path: path_value = {
        value:"inputFile.txt"
    };
    let word_freqs = sort(frequencies(extract_words(path))).value
    for (let i = 0; i < 25; i++){
        console.log("top25 = "+word_freqs[i])
    }
}
if (this == global) {
    main()
}

//or insted we can use the following to test if we are in global scope
/*
if (require.main == module) {
    main()  
}
*/
