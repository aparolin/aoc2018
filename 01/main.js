const fs = require('fs');

const inputString = fs.readFileSync('input.txt').toString();
const frequencies = inputString.split('\r\n');

function executePart1(){
  let resultingFreq = 0;
  frequencies.forEach(frequency => {
    resultingFreq += parseInt(frequency);
  });
  console.log(`Part 1: ${resultingFreq}`);  
}

function executePart2(){
  let reachedSameFrequencyTwice = false;
  let resultingFreq = 0;
  const seenFrequencies = new Set();
  while (!reachedSameFrequencyTwice){
    for (let i = 0; i < frequencies.length; i++){
      resultingFreq += parseInt(frequencies[i]);
  
      if (seenFrequencies.has(resultingFreq)){
        console.log(`Part 2: ${resultingFreq}`);
        reachedSameFrequencyTwice = true;
        break;
      }
  
      seenFrequencies.add(resultingFreq);
    }
  }
}

const start = new Date();
executePart1();
executePart2();
const elapsed = new Date() - start;
console.log(`Total time: ${elapsed}ms`);