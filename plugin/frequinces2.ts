export let top25 = (word_list) => {
    let wf = {}
    for (let i = 0; i < word_list.length; i++){
        for (let j = 0; j < word_list[i].length; j++){
            if (word_list[i][j] != '') {
                if (wf[word_list[i][j]] == undefined) {
                    wf[word_list[i][j]] = [word_list[i][j], 1, String(Number(Math.floor(i / 10) + 1))]
                }
                else {
                    wf[word_list[i][j]][1] = wf[word_list[i][j]][1]+1
                    if (wf[word_list[i][j]][2].split('-').indexOf(String(Number(Math.floor(i / 10) + 1))) == -1) {
                        wf[word_list[i][j]][2] = wf[word_list[i][j]][2]+"-"+String(Number(Math.floor(i / 10) + 1))
                    }
                }
            }
         

        }
    }
    let array=[];
    Object.keys(wf).sort().forEach(function (key) { array.push(`${wf[key]}`) });
    return array
}
