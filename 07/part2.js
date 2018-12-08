const fs = require('fs');

function dependenciesMet(step) {
  let fulfilled = true;
  let stepDependencies = dependencies.get(step);

  if (!stepDependencies) {
    return fulfilled;
  }

  for (let i = 0; i < stepDependencies.length; i++) {
    if (!order.includes(stepDependencies[i])) {
      fulfilled = false;
      break;
    }
  }

  return fulfilled;
}

function timeToCompleteStep(step) {
  const timeToCompleteStep = 60;
  return step.charCodeAt(0) - 64 + timeToCompleteStep;
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

  if (dependencies.has(tokens[2])) {
    dependencies.get(tokens[2]).push(tokens[1]);
  } else {
    dependencies.set(tokens[2], [tokens[1]]);
  }

  if (nextSteps.has(tokens[1])) {
    nextSteps.get(tokens[1]).push(tokens[2]);
  } else {
    nextSteps.set(tokens[1], [tokens[2]]);
  }
});

let order = [];
//find the initial step, which has no dependencies
let possibleNextSteps = [...steps].filter(step => !dependencies.has(step));

const totalWorkers = 5;
let activeWorkers = 0;

let pipeline = new Set();
let seconds = 0;
while (possibleNextSteps.length > 0 || pipeline.size > 0) {
  possibleNextSteps.sort();

  let next = [];
  //search for the next candidate(s) that fulfilled all dependencies
  for (var i = 0; i < possibleNextSteps.length; i++) {
    if (dependenciesMet(possibleNextSteps[i])) {
      // next.push(possibleNextSteps.splice(i, 1)[0]);
      next.push(possibleNextSteps[i]);
    }
  }

  next.forEach(step => {
    //new step being added to pipeline
    if (!pipeline.has(step) && activeWorkers < totalWorkers) {
      pipeline.add({
        step,
        elapsedSeconds: 0,
        worker: ++activeWorkers,
        timeToComplete: timeToCompleteStep(step)
      });

      //no longer consider the current step
      let index = possibleNextSteps.indexOf(step);
      if (index >= 0){
        possibleNextSteps.splice(index, 1);
      }
    }

    if (nextSteps.has(step)) {
      nextSteps.get(step).forEach(s => {
        if (!possibleNextSteps.includes(s)) {
          possibleNextSteps.push(s);
        }
      });
    }
  });

  //update pipeline
  pipeline.forEach(pipelineItem => {
    pipelineItem.elapsedSeconds++;

    if (pipelineItem.elapsedSeconds === pipelineItem.timeToComplete) {
      order.push(pipelineItem.step);
      pipeline.delete(pipelineItem);
      activeWorkers--;
    }
  });

  seconds++;
}


console.log(seconds);