const fs = require('fs');

function dependenciesMet(step){
  let fulfilled = true;
  let stepDependencies = dependencies.get(step);
  
  if (!stepDependencies){
    return fulfilled;
  }

  for (let i = 0; i < stepDependencies.length; i++){
    if (!order.includes(stepDependencies[i])){
      fulfilled = false;
      break;
    }
  }

  return fulfilled;
}

const inputString = fs.readFileSync('input.txt').toString();
const instructions = inputString.split('\r\n');

const dependencies = new Map();
const nextSteps = new Map();
const steps = new Set();
const re = /Step (\w) must be finished before step (\w) can begin./;
instructions.forEach(instruction => {
  const tokens = instruction.match(re);

  steps.add(tokens[1]);
  steps.add(tokens[2]);

  if (dependencies.has(tokens[2])){
    dependencies.get(tokens[2]).push(tokens[1]);
  } else {
    dependencies.set(tokens[2], [tokens[1]]);
  }

  if (nextSteps.has(tokens[1])){
    nextSteps.get(tokens[1]).push(tokens[2]);
  } else {
    nextSteps.set(tokens[1], [tokens[2]]);
  }
});

let order = [];
//find the initial step, which has no dependencies
let possibleNextSteps = [...steps].filter(step => !dependencies.has(step));

while (possibleNextSteps.length > 0){
  possibleNextSteps.sort();

  let nextStep = null;
  //search for the next candidate that fulfilled all dependencies
  for (var i = 0; i < possibleNextSteps.length; i++){
    if (dependenciesMet(possibleNextSteps[i])){
      nextStep = possibleNextSteps.splice(i, 1)[0];
      break;
    }
  }

  order.push(nextStep);

  if (nextSteps.has(nextStep)){
    nextSteps.get(nextStep).forEach(step => {
      if (!possibleNextSteps.includes(step)){
        possibleNextSteps.push(step);
      }
    });
  }
}

console.log(order.join(''));