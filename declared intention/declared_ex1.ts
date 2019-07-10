import { AssertionError } from "assert";

const fs = require('fs');//used to open files
const sw = require('stopword');
const _ = require('lodash')
let extract_words = (path_to_file) => {
    let data
    if (path_to_file == undefined || path_to_file == null || typeof (path_to_file) != typeof ("")) {
        console.log("I need a non-empty string! I quit!" )
       throw new AssertionError()
    }
    data=fs.readFileSync(path_to_file, 'utf8')
    data=data.replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ')
    return data
    
}
let remove_stop_words = (word_list) => {
    let stop_words
    if (!Array.isArray(word_list) ) {
        console.log("I need a list! I quit!")
        throw new AssertionError()
    }
    stop_words=fs.readFileSync("stop_words.txt", 'utf8')
    stop_words = stop_words.toLowerCase().split(',')
    let array:any=[]
    for (let i = 0; i < word_list.length; i++){
        if (stop_words.indexOf(word_list[i]) == -1) {
          array.push(word_list[i])  
        }
    }
    /*this cause an error
//     let word = {}
//     word["data"]=array
//    return word*/
    /*cause an error empty array error
    return []*/
   
     return array
}
let frequencies = (word_list) => {
    if (!Array.isArray(word_list) || word_list.length==0) {
        console.log("I need a non-empty list! I quit!")
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
   /* 
   this cause an error because it is empty object 
   return {}*/
    /*
    this cause error because it is not object
    return []
    */
    
}
let sort = (word_freq) => {
    if (typeof word_freq != 'object' ||Array.isArray(word_freq) ||_.isEmpty(word_freq)) {
        console.log("I need a non-empty dictionary! I quit!")
      throw new AssertionError()
    }
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
.forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
return array
}
try {
    let file_name = "inputFile.txt"
    if (typeof (file_name) != typeof ("")) {
        console.log("You idiot! I need an input file! I quit!");
        throw new AssertionError()
    }
    let word_freqs = sort(frequencies(remove_stop_words(extract_words(file_name))))
    for (let i = 0; i < 25; i++){
        console.log("top25 = "+word_freqs[i])
    }  
}
catch (error) {
    console.log(error)
}
