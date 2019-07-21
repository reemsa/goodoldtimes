// import * as readline from 'readline';

// let rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
//     rl.question('Is this example useful? [y/n] ', (answer) => {
//         switch(answer.toLowerCase()) {
//           case 'y':
//             console.log('Super!');
//             break;
//           case 'n':
//             console.log('Sorry! :(');
//             break;
//           default:
//             console.log('Invalid answer!');
//       }
//       console.log("wed")
//         rl.close();
//       });
const inquirer = require('inquirer')
let flage=true
var questions = [{
  type: 'input',
  name: 'name',
  message: "more? [y/n] ",
}]
function h() {
  inquirer.prompt(questions).then(answers => {
    if (answers['name'] == 'y') {
      console.log(`H ${answers['name']}!`)
      ask()
    }
    else if (answers['name'] == 'n') {
      console.log(`H ${answers['name']}!`)
    }
    else {
      console.log('your answer should be y or n')
  }
  }) 
}
function ask() {
  inquirer.prompt(questions).then(answers => {
    if (answers['name'] == 'y') {
      console.log(`Hi ${answers['name']}!`)
      ask()
    }
    else if (answers['name'] == 'n') {
      console.log(`Hi ${answers['name']}!`)
      h()
    }
    else {
      console.log('your answer should be y or n')
  }
  }) 
}
ask() 


