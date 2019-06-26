import { execSync } from "child_process";
import { start } from "repl";
const fs = require('fs');//used to open files
let stack :any= []
let heap = new Map();
const isAlphaNumeric = (ch: string) => {
  stack.push(ch)
  stack.push(' ')
  stack.push(stack.pop() == stack.pop())
  if (stack.pop()) {
    stack.push(' ')
    stack.push(' ')
    stack.push(stack.pop() == stack.pop())
    return 
  }
  stack.push(/^[a-z0-9]+$/i)
  stack.push(ch)
  stack.push(String( stack.pop()).match(stack.pop()))
  stack.push(null)
  stack.push(stack.pop()!==stack.pop())
  return
}
//used to compare two value and put result on the stack
function test2(t1:string,t2:string) {
    stack.push(t1);
    stack.push(t2);
    stack.push((stack.pop() > stack.pop()))
}
//pop file name from stack to read file and push contant back to stack 
function readfile() {
    let file = fs.readFileSync(stack.pop(),stack.pop());
    stack.push(file);
  //  console.log(file)
}
//replace nonalphanumaric char by white space
function filterChars() {    

    
   // let s = stack.pop().split('\n')
   // stack.push(s)
    heap.set("s", stack.pop().split('\n'))
    heap.set("i", 0)
   // console.log(heap.get("s").length)
    test2(heap.get("i"), heap.get("s").length)

    for (heap.set("i", 0); stack.pop();){

        heap.set("j", 0)
        test2(heap.get("j"), heap.get("s")[heap.get("i")].length)
        for (heap.set("j", 0); stack.pop();){
           heap.set(`s[${heap.get("i")}][${heap.get("j")}]`,heap.get("s")[heap.get("i")][heap.get("j")])
           // console.log("j=" + heap.get("j"))
          //console.log("heap="+heap.get(`s[${heap.get("i")}][${heap.get("j")}]`))
          stack.push(heap.get(`s[${heap.get("i")}][${heap.get("j")}]`))
          isAlphaNumeric(stack.pop())
            if (Boolean(stack.pop())) { 
               // console.log("inside if")
              stack.push(heap.get(`s[${heap.get("i")}][${heap.get("j")}]`).toLowerCase())
               heap.set(`s[${heap.get("i")}][${heap.get("j")}]`,stack.pop())

                 // console.log("if replace="+heap.get(`s[${heap.get("i")}][${heap.get("j")}]`))
            }
            else {
                //console.log("inside else ")
              stack.push(' ')
                heap.set(`s[${heap.get("i")}][${heap.get("j")}]`,stack.pop())
                //console.log("else replace="+heap.get(`s[${heap.get("i")}][${heap.get("j")}]`))
            }
            stack.push(1)
            stack.push(heap.get("j"))
            stack.push(stack.pop() + stack.pop())
            heap.set("j",stack.pop())
            //heap.set("j", heap.get("j") + 1)
            test2(heap.get("j"), heap.get("s")[heap.get("i")].length)

         
       
        }
        stack.push(1)
        stack.push(heap.get("i"))
        stack.push(stack.pop() + stack.pop())
        heap.set("i",stack.pop())         
        test2(heap.get("i"), heap.get("s").length)
    }
    heap.set("st", "")
    heap.set("i", 0)
   // console.log(heap.get("s").length)
    test2(heap.get("i"), heap.get("s").length)
    for (heap.set("i", 0); stack.pop(); ){
       // console.log("i="+heap.get("i"))
        
        heap.set("j", 0)
        test2(heap.get("j"), heap.get("s")[heap.get("i")].length)
        for (heap.set("j", 0); stack.pop();){
          //  console.log("j="+heap.get("j"))
          //  test( heap.get("j") , heap.get("s")[heap.get("i")].length)
          stack.push(heap.get(`s[${heap.get("i")}][${heap.get("j")}]`))
          stack.push(heap.get("st"))
          stack.push(stack.pop()+stack.pop())
            heap.set("st", stack.pop() )
            stack.push(1)
            stack.push(heap.get("j"))
            stack.push(stack.pop() + stack.pop())
            heap.set("j",stack.pop())
            //heap.set("j", heap.get("j") + 1)
            test2(heap.get("j"), heap.get("s")[heap.get("i")].length)
        // console.log(heap.get("st"))   
        } 
        stack.push(1)
        stack.push(heap.get("i"))
        stack.push(stack.pop() + stack.pop())
        heap.set("i",stack.pop())
        stack.push("\n")
        stack.push(heap.get("st"))
        stack.push(stack.pop() + stack.pop());
        heap.set("st", stack.pop() )   
        test2(heap.get("i"), heap.get("s").length)
    }
    

    stack.push(heap.get("st"))
    
}
//store file words in stack
function scan() {
   heap.set("s", stack.pop().split('\n'))
   stack.push(0)
   heap.set("i",stack.pop())
   test2(heap.get("i"), heap.get("s").length)
  //console.log(heap.get("s").length)
    for (heap.set("i", 0); stack.pop();){
      //  console.log(heap.get("s")[heap.get("i")] + ":" + heap.get("s")[heap.get("i")].trim().split(' ').length)
   // console.log("i1=" + heap.get("i"))
    heap.set("j", 0)
    test2(heap.get("j"), heap.get("s")[heap.get("i")].trim().split(' ').length)
      for (heap.set("j", 0); stack.pop();){
        
         //stack.push()
          // if (heap.get("s")[heap.get("i")].split(' ')[heap.get("j")] == ''||heap.get("s")[heap.get("i")].split(' ')[heap.get("j")] == '\n'||heap.get("s")[heap.get("i")].split(' ')[heap.get("j")] == ' '||heap.get("s")[heap.get("i")].split(' ')[heap.get("j")] == undefined) {
              
          // }
          //else {
        stack.push(heap.get("j"))
        stack.push(heap.get("i"))
        stack.push(heap.get("s")[stack.pop()].split(' ')[stack.pop()])
            //heap.set(`s1[${heap.get("i")}][${heap.get("j")}]`,heap.get("s")[heap.get("i")].split(' ')[heap.get("j")])
            heap.set(`s1[${heap.get("i")}][${heap.get("j")}]`,stack.pop())
            //  console.log("j1=" + heap.get("j"))
          //  console.log("heap="+heap.get(`s1[${heap.get("i")}][${heap.get("j")}]`))
         // }
   
       
        stack.push(1)
        stack.push(heap.get("j"))
        stack.push(stack.pop() + stack.pop())
        heap.set("j",stack.pop())
        //heap.set("j", heap.get("j") + 1)
        test2(heap.get("j"), heap.get("s")[heap.get("i")].trim().length)

     
   
    }
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop())
    heap.set("i",stack.pop())         
    test2(heap.get("i"), heap.get("s").length)
  }
  stack.push("")
  heap.set("st", stack.pop())
  stack.push(0)
heap.set("i", stack.pop())
//console.log(heap.get("s").length)
test2(heap.get("i"), heap.get("s").length)
for (heap.set("i", 0); stack.pop(); ){
    //console.log("i="+heap.get("i"))
    
    heap.set("j", 0)
    test2(heap.get("j"), heap.get("s")[heap.get("i")].trim().split(' ').length)
    for (heap.set("j", 0); stack.pop();){
        //console.log("j=" + heap.get("j"))
      stack.push(undefined)
      stack.push(heap.get(`s1[${heap.get("i")}][${heap.get("j")}]`))
      stack.push(stack.pop()==stack.pop())
        if (stack.pop()) {
            
        }
        else {
            stack.push(heap.get(`s1[${heap.get("i")}][${heap.get("j")}]`))
            //console.log("data1=" + heap.get(`s1[${heap.get("i")}][${heap.get("j")}]`))
        }
        
       // test( heap.get("j") , heap.get("s")[heap.get("i")].length)
        //heap.set("st", heap.get("st") + heap.get(`s1[${heap.get("i")}][${heap.get("j")}]`))
        stack.push(1)
        stack.push(heap.get("j"))
        stack.push(stack.pop() + stack.pop())
        heap.set("j",stack.pop())
        //heap.set("j", heap.get("j") + 1)
        test2(heap.get("j"), heap.get("s")[heap.get("i")].trim().split(' ').length)
    // console.log(heap.get("st"))   
    } 
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop())
    heap.set("i",stack.pop())
    //heap.set("i", heap.get("i") + 1)
   // heap.set("st", heap.get("st") + "\n")   
    test2(heap.get("i"), heap.get("s").length)
}  
}
//this function used to remove stop word from stack
function remove_stop_words() {
    heap.set("words","")
    stack.push('utf8')
    stack.push("stop_words.txt");
    let file = fs.readFileSync(stack.pop(),stack.pop());
    stack.push(file);
    heap.set("stop_words", stack.pop().split(','))
    //console.log("stop_words="+heap.get("stop_words"))
    while (stack.length > 0) {
        heap.set("data", stack.pop())
      //  console.log(heap.get("data"))
      //implement this stat with stack (heap.get("stop_words").indexOf(heap.get("data")) == -1)
      stack.push(heap.get("data"))
      stack.push(heap.get("stop_words"))
      stack.push(stack.pop().indexOf(stack.pop()))
      stack.push(-1)
      stack.push(stack.pop()==stack.pop())
        if (stack.pop()) {

            heap.set("words",heap.get("words")+","+heap.get("data"))
        }
        else {
          //  console.log("just drop it ")
        }
        
  }
  stack.push(heap.get("words"))
  heap.set("words", stack.pop().split(','))
  stack.push(1)
    heap.set("i",stack.pop())
    //console.log(heap.get("words").length)
    while (heap.get("i")<heap.get("words").length) {
        stack.push(heap.get("words")[heap.get("i")])  
       // console.log("data"+heap.get("i")+"="+heap.get("words")[heap.get("i")])
        stack.push(1)
        stack.push(heap.get("i"))
        heap.set("i", stack.pop() + stack.pop())
       // console.log("i="+heap.get("i"))
    }

}
//used to find frequ for each word and store word,frequ on the stack
function frequencies() {
  stack.push(0)
  heap.set("i",stack.pop())
  stack.push(stack.length)
  heap.set("length", stack.pop())
  stack.push('')
  heap.set("array",stack.pop())
  while (heap.get("i") < heap.get("length") ) {

    heap.set("data", stack.pop())
    //console.log(heap.get("data"))
    stack.push(undefined)
    stack.push(heap.get("data"))
    stack.push(stack.pop() !== stack.pop())
     heap.set("flage1",stack.pop())
     stack.push(undefined)
     stack.push(heap.get(`s[${heap.get("data")}]`))
     stack.push(stack.pop() == stack.pop())
     heap.set("flage2", stack.pop())
     stack.push(heap.get("flage1"))
    stack.push(heap.get("flage2"))
    stack.push(stack.pop() + stack.pop())
    stack.push(-1)
    stack.push(stack.pop()+stack.pop())
    // stack.push(Boolean(stack.pop()) && Boolean(stack.pop()))
    //console.log(stack.pop())
    //console.log(stack.pop())
    //if (heap.get(`s[${heap.get("data")}]`) == undefined&&heap.get("data")!=undefined) {
    if (stack.pop()) {
        
      stack.push(heap.get("data"))
      heap.set("array", heap.get("array") + "," + stack.pop())
      //console.log("array="+heap.get("array"))
      //console.log("inside if")
      heap.set(`s[${heap.get("data")}]`, heap.get("data") + "," + 1)
     // console.log("result="+heap.get(`s[${heap.get("data")}]`))
    }
    else {
      //console.log("inside else")
      stack.push(1)
      //console.log(heap.get(`s[${heap.get("data")}]`).split(',')[1])
      stack.push(Number( heap.get(`s[${heap.get("data")}]`).split(',')[1]))
      stack.push(stack.pop() + stack.pop())
     // console.log("pop="+stack.pop())
      stack.push(",")
      stack.push(heap.get("data"))
      stack.push(stack.pop()+stack.pop()+stack.pop())
      heap.set(`s[${heap.get("data")}]`, stack.pop())
      //console.log("result="+heap.get(`s[${heap.get("data")}]`))
      
    }
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop())
    heap.set("i",stack.pop())
      //   if (heap.get("word_freqs").split(",")[0].indexOf(heap.get("data")) == -1) {
      //     heap.set("word_freqs",heap.get("word_freqs")+"\n"+heap.get("data")+","+1)  
      //  } 
  }
  stack.push(heap.get("array").length)
  heap.set("length", stack.pop())
  stack.push(1)
  heap.set("i", stack.pop())
  //console.log(heap.get("array").length)
  heap.set("array",heap.get("array").split(','))
  while (heap.get("i") < heap.get("length")) {
    stack.push(undefined)
    stack.push(heap.get("i"))
    stack.push(heap.get("array")[stack.pop()])
    stack.push(stack.pop()==stack.pop())
    
    //if (heap.get("array")[heap.get("i")] == undefined) {
    if(stack.pop()) {
    }
  else
{   // console.log(heap.get("array")[heap.get("i")])
    stack.push(heap.get("array")[heap.get("i")])
    //console.log(heap.get(`s[${stack.pop()}]`))
    stack.push(heap.get(`s[${stack.pop()}]`))
  
    }
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop())
    heap.set("i",stack.pop())}
}
//sort word depends on it is freq
function sort() {
  stack.push(stack.length)
  heap.set("length", stack.pop())
  stack.push(0)
  heap.set("i", stack.pop())
  stack.push(0)
  heap.set("count", stack.pop())
  stack.push(0)
  heap.set("max", stack.pop())
  stack.push('')
  heap.set("array", stack.pop())
  test2(heap.get("i"),heap.get("length"))
  while (stack.pop()) {
    heap.set("data", stack.pop())
    test2(heap.get("count"),"25")
    //there is still space because we dont store 25 value yet
    if (stack.pop()) {
      stack.push(1)
      stack.push(heap.get("count"))
      stack.push(stack.pop() + stack.pop());
      heap.set("count", stack.pop())
      stack.push(heap.get("data"))
      heap.set(`array[${Number( heap.get("count"))}]`, stack.pop())
      //console.log("rff="+heap.get(`array[${heap.get("count")}]`))
    }
    else {
      stack.push(1)
      heap.set("count2", stack.pop())
      test2(heap.get("count2"),"25")
      while (stack.pop()) {
      // console.log(heap.get("data"))
       stack.push(heap.get(`array[${heap.get("count2")}]`).split(',')[1])
       stack.push(heap.get("data").split(',')[1])
       stack.push(Number(stack.pop())>Number(stack.pop()))
      // if (Number(heap.get("data").split(',')[1]) >Number(heap.get(`array[${heap.get("count2")}]`).split(',')[1])) {
       if(stack.pop()){ 
       heap.set("tmp", heap.get(`array[${heap.get("count2")}]`))
          heap.set(`array[${heap.get("count2")}]`, heap.get("data"))
          heap.set("data",heap.get("tmp"))
          //console.log("swap"+heap.get("count2")+"="+heap.get(`array[${Number( heap.get("count2"))}]`))
          //break
       }
       stack.push(1)
       stack.push(heap.get("count2"))
       stack.push(stack.pop() + stack.pop());
       heap.set("count2",stack.pop())
       test2(heap.get("count2"),"25")
      }
    }
   
   // test2(heap.get("max"),heap.get("data").split(',')[1])
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop());
    heap.set("i",stack.pop())
    test2(heap.get("i"),heap.get("length"))
 
  }
  stack.push(1)
  heap.set("i", stack.pop())
  test2(heap.get("i"),"25")
  while (stack.pop()){
    //console.log("jhjh")
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop())
    heap.set("j", stack.pop())
    test2(heap.get("j"),"25")
    while (stack.pop()){
      stack.push(Number(heap.get(`array[${heap.get("j")}]`).split(',')[1].trim()))
      stack.push(Number(heap.get(`array[${heap.get("i")}]`).split(',')[1].trim()))
      stack.push(stack.pop()>stack.pop())
     // if (Number( heap.get(`array[${heap.get("i")}]`).split(',')[1].trim()) >Number( heap.get(`array[${j}]`).split(',')[1].trim())) {
      if(stack.pop()){
     //console.log("inside ")
        heap.set("tmp", heap.get(`array[${heap.get("i")}]`))
        heap.set(`array[${heap.get("i")}]`, heap.get(`array[${heap.get("j")}]`))
        heap.set(`array[${heap.get("j")}]`,heap.get("tmp"))
      }
      stack.push(1)
      stack.push(heap.get("j"))
      stack.push(stack.pop() + stack.pop())
      heap.set("j", stack.pop())
      test2(heap.get("j"),"25")
    }
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() + stack.pop())
    heap.set("i", stack.pop())
    test2(heap.get("i"),"25")
  }
  stack.push(25)
  heap.set("i", stack.pop())
  test2("1",heap.get("i"))
  while (stack.pop()) {
    stack.push(heap.get("i"))
    console.log("word=" + heap.get(`array[${stack.pop()}]`))
    stack.push(1)
    stack.push(heap.get("i"))
    stack.push(stack.pop() - stack.pop())
    heap.set("i", stack.pop())
    test2("1",heap.get("i"))

  }
  
}
//main function 
function run(filename: string) {
    stack.push('utf8')
    stack.push(filename);
    readfile()
    filterChars()
    scan()
    remove_stop_words()
    frequencies()
    sort()    
}
//calling main function 
run("inputFile.txt")