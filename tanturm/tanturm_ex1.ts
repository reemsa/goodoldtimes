import { AssertionError } from "assert";

const fs = require('fs');//used to open files
const sw = require('stopword');
let extract_words = (path_to_file) => {
    let data
    if ( typeof (path_to_file) != typeof ("")) {
        console.log("I need a string!" )
        throw new AssertionError()
    }
    if (path_to_file == undefined || path_to_file == null) {
        console.log("I need a non-empty string!")
        throw new AssertionError()
    }
    try {
         data=fs.readFileSync(path_to_file, 'utf8')
    }
    catch (error) {
        console.log("I/O error when opening")
        throw error
    }
    data=data.replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')
    return data
    
}
let remove_stop_words = (word_list) => {
    let stop_words
    if (!Array.isArray(word_list)) {
        console.log("I need a list!")
        throw new AssertionError()
    }
    try {
        stop_words=fs.readFileSync("stop_words.txt", 'utf8')
   }
   catch(error) {
       console.log("I/O error when opening file")
        throw error
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
        console.log("I need a list and non-empty list!")
        throw new AssertionError()
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
        console.log("I need a non-empty dictionary!")
        throw new AssertionError()
    }
    let array: any = []
    try {
        Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
        .forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
        return array.slice(0,25)
    }
    catch (error) {
        throw error
    }
  
}
try {
    let file_name = "inputFile.txt"
    if (typeof (file_name) != typeof ("") || file_name == undefined) {
        console.log("You idiot! I need an input file!")
        throw new AssertionError()
    }
    let word_freqs = sort(frequencies(remove_stop_words(extract_words(file_name))))
    if (typeof (word_freqs) != typeof ([])) {
        console.log("OMG! This is not a list!")
        throw new AssertionError()
    }
    console.log("len="+word_freqs.length)
    if (word_freqs.length > 25) {
        console.log("SRSLY? Less than 25 words!")
        throw new AssertionError()
    }
    for (let i = 0; i < 25; i++) {
        console.log("top25 = " + word_freqs[i])
    }
}
catch (error) {
    throw error
}
