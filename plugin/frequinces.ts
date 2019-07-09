export let top25 = (word_list) => {
    let word_freq={}
    for (let i = 0; i < word_list.length; i++){
        if (word_freq[word_list[i]] == undefined) {
            word_freq[word_list[i]] = 1 
        }
        else {
            word_freq[word_list[i]] += 1
        }
    }
    let array:any=[]
    Object.keys(word_freq).sort(function (a, b) { return word_freq[b] - word_freq[a] })
        .forEach(function (key) { array.push(`${key},${word_freq[key]}`) });
    array=array.slice(0,25)
return array
}
