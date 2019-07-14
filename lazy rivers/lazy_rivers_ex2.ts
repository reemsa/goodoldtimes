const fs = require('fs');
function* all_words(filename) {
    let line = fs.readFileSync(filename, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(" ")   
    for (let i = 0; i < line.length; i++){
            yield line[i]
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


