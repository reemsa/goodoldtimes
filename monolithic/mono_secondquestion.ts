const fs = require('fs');//used to open files
let stop_words = fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(',');
let input_file = fs.readFileSync('inputFile.txt', 'utf8').split('\n');
let word_freq: any = [];
let word = ''
let pair_index=0;
let found: boolean;
interface data{
    freq: number
    word:string
}
for (let r = 0; r < input_file.length; r++){
    let line = input_file[r];
        let start_char =undefined
       
            for (let c = 0; c < line.length; c++){
            //console.log(line[c])
                if (start_char == undefined) {
               // console.log("first char")
                    if (line[c] >= '0' && line[c] <= '9' || line[c] >= 'a' && line[c] <= 'z' || line[c] >= "A" && line[c] <= "Z") {
                    start_char=c
                }
            }
    
                else {
                    //console.log("inside else")
            if (!(line[c] >= '0' && line[c] <= '9') && !(line[c] >= 'a' && line[c] <= 'z') && !(line[c] >= "A" && line[c] <= "Z")) { 
                found=false
                word = line.substring(start_char, c).toLowerCase();   
                    if (stop_words.indexOf(word.trim()) == -1) {
                        pair_index=0
                        for (let k =0 ; k< word_freq.length; k++){
                            if (word.trim() == word_freq[k].word) {
                            word_freq[k].freq+=1;
                                found = true
                                break
                            }
                            pair_index+=1
                        }
                        //if it not in word_freq array that mean it the first time we read this word
                        if (!found) {
                            word_freq.push({freq:1,word:word});
                            
                        }
                        else if (word_freq.length>1){
                            for (let n=pair_index-1;n>=0;n--){
                                if (word_freq[pair_index].freq>word_freq[n].freq){
                                    //swap
                                    let temp=word_freq[n]
                                    word_freq[n]=word_freq[pair_index];
                                    word_freq[pair_index]=temp;
                                    pair_index=n;
                                }
                            }
                        }
                    }
                  
                    start_char = undefined
                  
                    
                }
                
            }
          
        }
        
}

for (let i = 0; i < 25; i++){
    console.log("data = "+word_freq[i].word+","+word_freq[i].freq)
}
