const fs = require('fs');
const sw = require('stopword');
let extract_words=(path_to_file)=> {
    let input_file = sw.removeStopwords(fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(" "))   
    return input_file
}
let frequencies=(word_list)=> {
    let word_freq = {}
    for (let i = 0; i < word_list.length; i++){
        let word = word_list[i]
        if (word_freq[word] == undefined) {
            word_freq[word] = 1 
        }
        else {
            word_freq[word] += 1
        } 
    }
    return word_freq
}
let sort=(word_freq)=> {
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
.forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
return array
}
//The side function
function profile(f) {
    function profilewrapper(...arg) {
        let start_time:number = Number(new Date().getMilliseconds());
        let ret_value = f(...arg);
        let end_time: number = Number(new Date().getMilliseconds());
        let elapsed:number = end_time-start_time
        console.log("function name = "+f.name+" and elapesd ="+elapsed)
        return ret_value
    }
    return profilewrapper
}
let tracked_functions = [extract_words, frequencies, sort]
extract_words = profile(tracked_functions[0]);
frequencies = profile(tracked_functions[1]);
sort = profile(tracked_functions[2]);
for (let i = 0; i < tracked_functions.length; i++){
    extract_words = profile(tracked_functions[0]);
}
let word_freqs = sort(frequencies(extract_words("inputFile.txt")))
for (let i = 0; i < word_freqs.length; i++){
    console.log("top25 ="+word_freqs[i])
}