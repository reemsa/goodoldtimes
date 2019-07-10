const fs = require('fs');//used to open files
const sw = require('stopword');
let extract_words = (path_to_file) => {
    let data
    if (path_to_file == undefined || path_to_file == null || typeof (path_to_file) != typeof ("")) {
        return []
    }
    try {
         data=fs.readFileSync(path_to_file, 'utf8')
    }
    catch(error) {
        console.log("I/O error when opening file")
        return []
    }
    data=data.replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')
    return data
    
}
let remove_stop_words = (word_list) => {
    let stop_words
    if (!Array.isArray(word_list) ) {
        return {}
    }
    try {
        stop_words=fs.readFileSync("stop_words.txt", 'utf8')
   }
   catch(error) {
       console.log("I/O error when opening file")
       return []
   }
    stop_words = stop_words.toLowerCase().split(',')
    let array=[]
    for (let i = 0; i < word_list.length; i++){
        if (stop_words.indexOf(word_list[i]) == -1) {
          array.push(word_list[i])  
        }
    }
   return array
   
}
let frequencies = (word_list) => {
    if (!Array.isArray(word_list) || word_list.length==0) {
        return {} 
    }
    let word_freqs = {}
    for (let w = 0; w < word_list.length;w++) {
        if (word_freqs[word_list[w]] == undefined) {
            word_freqs[word_list[w]] = 1 
        }
        else {
           word_freqs[word_list[w]] += 1
        }
    } 
    return word_freqs
}
let sort = (word_freq) => {
    if (typeof word_freq != 'object' ||Array.isArray(word_freq) ||_.isEmpty(word_freq)) {
      return []  
    }
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
.forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
return array
}
let word_freqs = sort(frequencies(remove_stop_words(extract_words("inputFile.txt"))))
for (let i = 0; i < 25; i++){
    console.log("top25 = "+word_freqs[i])
}