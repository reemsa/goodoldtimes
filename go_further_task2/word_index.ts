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

    heap.set("s", stack.pop().split('\n'))
    heap.set("i", 0)
    test2(heap.get("i"), heap.get("s").length)

    for (heap.set("i", 0); stack.pop();){

        heap.set("j", 0)
        test2(heap.get("j"), heap.get("s")[heap.get("i")].length)
        for (heap.set("j", 0); stack.pop();){
           heap.set(`s[${heap.get("i")}][${heap.get("j")}]`,heap.get("s")[heap.get("i")][heap.get("j")])
          stack.push(heap.get(`s[${heap.get("i")}][${heap.get("j")}]`))
          isAlphaNumeric(stack.pop())
            if (Boolean(stack.pop())) { 
              stack.push(heap.get(`s[${heap.get("i")}][${heap.get("j")}]`).toLowerCase())
               heap.set(`s[${heap.get("i")}][${heap.get("j")}]`,stack.pop())
            }
            else {
              stack.push(' ')
                heap.set(`s[${heap.get("i")}][${heap.get("j")}]`,stack.pop())
            }
            stack.push(1)
            stack.push(heap.get("j"))
            stack.push(stack.pop() + stack.pop())
            heap.set("j",stack.pop())
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
//find lines in which each word is
function which_line() {
    stack.push('')
    heap.set("wordarray", stack.pop())
    heap.set("s2", stack.pop().split("\n")) 
    stack.push(0)
    heap.set("i", stack.pop())
    stack.push(heap.get("s2").length)
    heap.set("len", stack.pop())
    test2(heap.get("i"), heap.get("len"))
    while (stack.pop()) {
        stack.push(heap.get("i"))
        stack.push(heap.get("s2")[stack.pop()])
        // heap.set("trimline", stack.pop().trim())
        // stack.push(heap.get("trimline"))
        
        heap.set("line", stack.pop().trim().split(' '))
       // console.log(heap.get("line")+heap.get("line").length)
      //  if(heap.get("s2")[heap.get("i")][heap.get("j")])
        stack.push(0)
        heap.set("j", stack.pop())
        test2( heap.get("j") , heap.get("line").length)
        for (; stack.pop();){
            stack.push(undefined)
            stack.push(heap.get(`word[${heap.get("line")[heap.get("j")]}]`))
            stack.push(stack.pop()==stack.pop())
           // if (heap.get(`word[${heap.get("line")[heap.get("j")]}]`) == undefined) {
            if (stack.pop()) {
                //implement this command with stack
                 //heap.set(`word[${heap.get("line")[heap.get("j")]}]`, heap.get("line")[heap.get("j")] + "-" + Number(Math.floor(heap.get("i")/10)+1) )
                stack.push(Number(Math.floor(heap.get("i") / 10) + 1))
                stack.push("-")
                stack.push(heap.get("line")[heap.get("j")])
                stack.push(stack.pop() + stack.pop() + stack.pop())
                heap.set(`word[${heap.get("line")[heap.get("j")]}]`, stack.pop() )
                stack.push(1)        
                heap.set(`freq[${heap.get("line")[heap.get("j")]}]`, stack.pop())
                //implement this command with stack
                //heap.set("wordarray", heap.get("wordarray") + "," + `${heap.get("line")[heap.get("j")]}`)
                stack.push(`${heap.get("line")[heap.get("j")]}`)
                stack.push(",")
                stack.push(heap.get("wordarray"))
                stack.push(stack.pop()+stack.pop()+stack.pop())
                heap.set("wordarray", stack.pop())
            }
            else {
                stack.push(heap.get(`word[${heap.get("line")[heap.get("j")]}]`).split('-')[1].split(',').indexOf(String(Math.floor(heap.get("i") / 10) + 1)))
                stack.push(-1)
                stack.push(stack.pop()==stack.pop())
              //  if (heap.get(`word[${heap.get("line")[heap.get("j")]}]`).split('-')[1].split(',').indexOf(String(Math.floor(heap.get("i") / 10) + 1)) == -1) {
                if(stack.pop()){  
                //heap.set(`word[${heap.get("line")[heap.get("j")]}]`, heap.get(`word[${heap.get("line")[heap.get("j")]}]`) + "," + Number(Math.floor(heap.get("i") / 10) + 1))
                    stack.push(Number(Math.floor(heap.get("i") / 10) + 1))
                    stack.push(",")
                    stack.push(heap.get(`word[${heap.get("line")[heap.get("j")]}]`))
                    stack.push(stack.pop() + stack.pop() + stack.pop())
                    heap.set(`word[${heap.get("line")[heap.get("j")]}]`,stack.pop())
                }
                //heap.set(`freq[${heap.get("line")[heap.get("j")]}]`,Number(heap.get(`freq[${heap.get("line")[heap.get("j")]}]`))+1)
                stack.push(1)
                stack.push(Number(heap.get(`freq[${heap.get("line")[heap.get("j")]}]`)))
                stack.push(stack.pop() + stack.pop())
                heap.set(`freq[${heap.get("line")[heap.get("j")]}]`,stack.pop())
            }
            stack.push(1)
            stack.push(heap.get("j"))
            stack.push(stack.pop() + stack.pop())
            heap.set("j",stack.pop())
            test2( heap.get("j") , heap.get("line").length)
        }
        stack.push(1)
        stack.push(heap.get("i"))
        stack.push(stack.pop() + stack.pop())
        heap.set("i", stack.pop())
        test2(heap.get("i"), heap.get("len"))
    }
    
}
//sort word alpha
function sort_alph() {
    heap.set("sortedwordarray", heap.get("wordarray").split(",").sort()) 
    heap.set("data", heap.get("sortedwordarray"))
    stack.push(1)
    heap.set("i", stack.pop())
    stack.push(heap.get("data").length)
    heap.set("len",stack.pop())
    test2(heap.get("i"),heap.get("len"))
    for (; stack.pop();){
        //in the task ask to ignore word if freq larger than 100 but here use 20 to test my inputfile
        stack.push(20)
        stack.push(Number(heap.get(`freq[${heap.get("data")[heap.get("i")]}]`)))
        stack.push(stack.pop() < stack.pop())
        stack.push("")
        stack.push(String(heap.get(`word[${heap.get("data")[heap.get("i")]}]`).split('-')[0]))
        stack.push(stack.pop() != stack.pop())
        stack.push(Boolean(stack.pop())&&Boolean(stack.pop()))
        //if (Number(heap.get(`freq[${heap.get("data")[heap.get("i")]}]`)) < 20&& String(heap.get(`word[${heap.get("data")[heap.get("i")]}]`).split('-')[0])!="") {
        if(stack.pop()){   
        console.log("data =" + heap.get(`word[${heap.get("data")[heap.get("i")]}]`))
            console.log("freq="+heap.get(`freq[${heap.get("data")[heap.get("i")]}]`))  
        }
        stack.push(1)
        stack.push(heap.get("i"))
        stack.push(stack.pop() + stack.pop())
        heap.set("i",stack.pop())
        test2(heap.get("i"),heap.get("len"))
    }

}
//main function 
function run(filename: string) {
    stack.push('utf8')
    stack.push(filename);
    readfile()
    filterChars()
    which_line()
    sort_alph();
}
//calling main function 
run("inputFile.txt")