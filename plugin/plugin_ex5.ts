import * as word1 from './word3'
import * as freq1 from './frequinces2'
let word_freqs = freq1.top25(word1.extract_words("inputFile.txt"))
for (let i = 0; i < word_freqs.length; i++){
    if (word_freqs[i].split(",")[1] < 25) {
    console.log(word_freqs[i].split(",")[0]+":"+word_freqs[i].split(",")[2])
}
}
