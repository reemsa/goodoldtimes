const fs = require('fs');//used to open files
const lineReader = require('line-reader'); //used to read line by line of input file
let stop_words = fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(',');
let word_freq: any = [];
let found: boolean;
interface data{
    freq: number
    word:string
}
let x:data={freq:0,word:""}
word_freq.push(x)
lineReader.eachLine('inputFile.txt', function (line: string, last: boolean) { 
    if (line) {
    let start_char =undefined
        let word = ''
        //console.log(line)
        //console.log(line.length)
        // for (let i = 0; i < line.length; i++){
        //     if (!(line[i] > '0' && line[i] < '9') && !(line[i] > 'a' && line[i] < 'z') && !(line[i] > "A" && line[i] < "Z")) {
        //         console.log(line[i])
        //      }
        // }
        for (let c = 0; c < line.length; c++){
        //console.log(line[c])
            if (start_char == undefined) {
           // console.log("first char")
                if (line[c] >= '0' && line[c] <= '9' || line[c] >= 'a' && line[c] <= 'z' || line[c] >= "A" && line[c] <= "Z") {
                   // console.log("first char 2")
            start_char=c
            }
        }

            else {
                //console.log("inside else")
        if (!(line[c] >= '0' && line[c] <= '9') && !(line[c] >= 'a' && line[c] <= 'z') && !(line[c] >= "A" && line[c] <= "Z")) { 
         //  if (line[c] == ' ') {
                word = line.substring(start_char, c + 1).toLowerCase();
                 
                // console.log(stop_words.indexOf(String(word.trim())))
                // console.log()              
                if (stop_words.indexOf(word.trim()) == -1) {
                    //console.log(word)
                    //iterate over word_freq array to check if word already in the array
                    //console.log(word_freq.length)
                    for (let i =1 ; i < word_freq.length; i++){

                        //console.log(word+":"+word_freq[i].split(',')[1])
                        if (word.trim() == word_freq[i].word.trim()) {
                            //console.log("inside ==")
                           // x=Number(word_freq[i].split(',')[0])+1
                            //console.log(x)
                            //word_freq[i].split(',')[0] =String(Number(Number(word_freq[i].split(',')[0]) +1)) ;
                           x={freq:Number(word_freq[i].freq) + 1,word:word}
                            word_freq[i] = x
                           // word_freq[i]=
                           // console.log(word_freq[i].split(',')[1] + "," + word_freq[i].split(',')[0])
                            found = true
                            
                            break
                        }
                    }
                    //if it not in word_freq array that mean it the first time we read this word
                    if (!found) {
                       x={freq:1,word:word}
                       // word_freq.push(`1,${word}`);
                        word_freq.push(x)
                        //console.log(`${word},1`)
                        
                    }
                    //here we need to reorder array depend on freq
                    // if (word_freq.length > 1) {
                    //     word_freq.sort()
                    // }
                }
              
                start_char = undefined
                found=false
                
            }
            
        }
      
    }
    }
    if (last) {
        let tmp:any
        for (let i = 0; i < word_freq.length;i++){
            for (let j = i + 1; j < word_freq.length;j++){
                if (word_freq[i].freq < word_freq[j].freq) {
                    tmp = word_freq[i]
                    word_freq[i] = word_freq[j]
                    word_freq[j]=tmp
                }
            }
        }
        for (let i = 0; i < 25; i++){
            //word_freq.sort()
            //console.log("data = "+word_freq[i].split(',')[1]+","+word_freq[i].split(',')[0]) 

            console.log("data = "+word_freq[i].word+","+word_freq[i].freq)
        }
       
    }
})
