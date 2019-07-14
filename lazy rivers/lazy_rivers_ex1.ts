const fs = require('fs');
const isAlphaNumeric = (ch: string) => {
    if (ch==' ')return false;
    return ch.match(/^[a-z0-9]+$/i) !== null;
  }
function* characters(filename:any) {
    let line = fs.readFileSync(filename, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split("\n")  
    for (let i = 0; i < line.length; i++){
        for (let j = 0; j < line[i].length; j++){
            yield line[i][j]
        }
    }
}
function* all_words(filename) {
    var iterator = characters(filename);
    let start_char = true
    let word = ""
    while (true) {
        let c = iterator.next();
        if (c['done'] == true) {
            break
        }
        if (start_char == true) {
            if (isAlphaNumeric(c['value'])) {
                word = c['value']
                start_char=false
            }
        }
        else {
            if (isAlphaNumeric(c['value'])) {
                word += c['value']
            }
            else {
                start_char = true
                yield word
            }
        }      
    }    
}

function* non_stop_words(filename) {
    let gen = all_words(filename)
    let stop_words = fs.readFileSync('stop_words.txt', 'utf8').split(',');

    while (true) {
        let x = gen.next();
        if (stop_words.indexOf(x['value']) == -1) {
            yield x['value']
        }
        if (x['done'] == true) {
            break
        }
    
    }
}
function* count_and_sort(filename) {
    let freqs = {}
    let i = 1
    let gen = non_stop_words(filename);
while (true) {
    let x = gen.next();
    if (freqs[x['value'] as any] == undefined) {
        freqs[x['value'] as any]=1
    }
    else {
        freqs[x['value'] as any]+=1 
    }
    if (x['done'] == true) {
        let array:any=[]
        Object.keys(freqs).sort(function (a, b) { return freqs[b] - freqs[a] }).forEach(function(key) { array.push(`${key},${freqs[key]}`)});
        yield array
        break

    }
}
}
let x = count_and_sort("inputFile.txt")
let data=x.next()
for (let i = 0; i < 25; i++){
    console.log("top25 ="+data['value'][i])   
}


