const fs = require('fs');
function* all_words(filename) {
    let line = fs.readFileSync(filename, 'utf8').replace(/[^A-Za-z0-9\n]+/g, " ").toLowerCase().split("\n")   
    for (let i = 0; i < line.length; i++){
        line[i]=line[i].split(" ")
        for (let j = 0; j < line[i].length; j++){
            yield [line[i][j], String(Number(Math.floor(i / 10) + 1))]
        }
    }
}
function* non_stop_words(filename) {
    let gen = all_words(filename)
    let stop_words = fs.readFileSync('stop_words.txt', 'utf8').split(',');

    while (true) {
        let x = gen.next();
        if (x['done'] == true) {
            break
        }
        if (stop_words.indexOf(x['value'][0]) == -1) {
            yield x['value']
        }    
    }
}
function* count_and_sort(filename) {
    let freqs = {}
    let gen = non_stop_words(filename);
while (true) {
    let x = gen.next();
    if (x['done'] == true) {
        let array:any=[]
        Object.keys(freqs).sort().forEach(function(key) { array.push(`${freqs[key]}`)});
        yield array
        break

    }
    if (freqs[x['value'][0]] == undefined) {
        freqs[x['value'][0]]=[x['value'][0],1,x['value'][1]]
    }
    else {
        freqs[x['value'][0]][1] += 1 
        if (freqs[x['value'][0]][2].split('-').indexOf(x['value'][1]) == -1) {
            freqs[x['value'][0]][2] = freqs[x['value'][0]][2]+"-"+x['value'][1]
        }
    }
}
}
let x = count_and_sort("inputFile.txt")
let data=x.next()
for (let i = 1; i < data['value'].length; i++){
    console.log("word ="+data['value'][i])   
}


