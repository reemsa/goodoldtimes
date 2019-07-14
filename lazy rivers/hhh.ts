function* idMaker(){
    let index = 0;
    while(index < 3)
      yield index++;
  }
  
let gen = idMaker();
while (true) {
    let x = gen.next();
    console.log(x)
    if (x['done'] == true) {
        console.log("done")
        break
    }
  
}
