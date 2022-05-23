const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const output = fs.createWriteStream(filePath);
const rl = readline.createInterface(process.stdin, process.stdout);

rl.question('Write your text...\n', text => {
  if (text.trim() === 'exit') {
    rl.close();
  } else {
    output.write(text);
  }

  rl.on('line', input => {
    if (input.trim() === 'exit') {
      rl.close();
    } else {
      output.write(input);
    }
  });
});

rl.on('close', () => {
  console.log('Bye!');
});
