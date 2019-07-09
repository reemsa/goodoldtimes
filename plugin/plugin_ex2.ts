import * as word2 from './word2'
import * as freq1 from './frequinces'
let word_freqs = freq1.top25(word2.extract_words("inputFile.txt"))
console.log(word_freqs)
