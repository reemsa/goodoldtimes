const fs = require('fs');
const sw = require('stopword');
let extract_words = (path_to_file) => {
    let array:any[]=[]
    let input_file = (fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split("\n"))   
    for (let i = 0; i < input_file.length; i++){
        input_file[i] = sw.removeStopwords(input_file[i].split(" "))
        for (let j = 0; j < input_file[i].length; j++){
            if(input_file[i][j]!="")
            array.push([input_file[i][j],i])  
        }
    }
    return array
}
let frequencies=(word_list)=> {
    let word_freq = {}
    for (let i = 0; i < word_list.length; i++){
        let word = word_list[i]
        if (word_freq[word[0]] == undefined) {
            word_freq[word[0]] = [word[0],1,String(Number(Math.floor(word[1] / 10) + 1))] 

        }
        else {
            word_freq[word[0]][1] += 1
            if (word_freq[word[0]][2].split("-").indexOf(String(Number(Math.floor(word[1] / 10) + 1))) == -1) {
                word_freq[word[0]][2]=word_freq[word[0]][2]+"-"+String(Number(Math.floor(word[1]  / 10) + 1))
            }
        } 
    }
    return word_freq
}
let sort=(word_freq)=> {
    let array:any=[]
    Object.keys(word_freq).sort()
.forEach(function (key) { array.push(`${word_freq[key]}`) });
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
    //if freq larger then 25 ignore it in task ask if freq larger than 100 but here i am using 25 
    if (word_freqs[i].split(",")[1] < 25) {
        console.log("data = "+word_freqs[i].split(',')[0]+":"+word_freqs[i].split(',')[2])
        }
        
    }