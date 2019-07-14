const fs=require("fs");
let wf={};

function all_words(file_path:string){
    let data=fs.readFileSync(file_path,'utf8').replace(/[\W]+/g, " ").toLowerCase().split(" ")
    let it=data[Symbol.iterator]()
    while(true){
        let x=it.next();
        if (x['done']) break;
        else  non_stop_words(x['value']);
    }
    return sort();
}



function non_stop_words(word){
    let stop_words=fs.readFileSync('stop_words.txt','utf8').split(",");
    if (stop_words.indexOf(word)==-1) count(word)
    return;

}

function count(word){

    if (wf[word]!=undefined){
        wf[word]+=1
    }
    else {
        wf[word]=1
    }
    return;
}

function sort() {
    let array:any=[]
    Object.keys(wf).sort(function (a, b) { return wf[b] - wf[a] }).forEach(function(key) { array.push(`${key},${wf[key]}`)});
    return array
}


let arr=all_words("inputFile.txt")

for (let i=0;i<25;i++){
    console.log("top25= "+arr[i])
}