import * as word1 from './word1'
import * as freq1 from './frequinces'
import {print} from './print'
let word_freqs = freq1.top25(word1.extract_words("inputFile.txt"))
print(word_freqs)
