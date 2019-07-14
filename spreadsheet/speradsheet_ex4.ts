const fs = require('fs')
let all_words: any = [[], null]
let stop_words:any = [[], null]
let remove_stop_words = () => {
    let index = []
    for (let j = 0; j < all_words[0].length;j++)
    {
        all_words[0][j]=all_words[0][j].split(" ")
        for (let i = 0; i < all_words[0][j].length; i++){
            if (stop_words[0].indexOf(all_words[0][j][i]) == -1 && all_words[0][i]!= '') {
                index.push([all_words[0][j][i], String(Number(Math.floor(j / 10) + 1))]) 
            }
        }
    }  
    return index 
}
let unique_non_stop_words:any = [[], remove_stop_words]
let find_count = () => {
    let wf = {}

    for (let w = 0; w < unique_non_stop_words[0].length; w++) {
        if (wf[unique_non_stop_words[0][w][0]] == undefined) {
          wf[unique_non_stop_words[0][w][0]]=[unique_non_stop_words[0][w][0],1,unique_non_stop_words[0][w][1]]
        }
        else {
            wf[unique_non_stop_words[0][w][0]][1] += 1 
            if (wf[unique_non_stop_words[0][w][0]][2].split('-').indexOf(unique_non_stop_words[0][w][1]) == -1) {
                wf[unique_non_stop_words[0][w][0]][2] = wf[unique_non_stop_words[0][w][0]][2]+"-"+unique_non_stop_words[0][w][1]
            }
      }  
    }
    return wf
}
let counts :any= [{}, find_count]
let sorted = () => {
    let array=[];
    Object.keys(counts[0]).sort().forEach(function(key) { array.push(`${counts[0][key]}`)});
    return array
}
let sorted_data:any = [[], sorted]
let all_columns:any = [all_words, stop_words, unique_non_stop_words, counts, sorted_data]
function update() {
    for (let i = 0; i < all_columns.length; i++){
        if (all_columns[i][1] != null) {
            all_columns[i][0]=all_columns[i][1]()
        }
    }
}
all_words[0] = fs.readFileSync('inputFile.txt', 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split('\n')
stop_words[0]=fs.readFileSync('stop_words.txt', 'utf8').toLowerCase().split(',')
update()
for (let i = 1; i < sorted_data[0].length; i++){
    console.log("word = "+sorted_data[0][i])
}
