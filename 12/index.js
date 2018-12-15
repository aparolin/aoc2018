function parse(input){
  let initialState = null;
  let rules = new Set();
  input.split('\r\n').forEach((line, index) => {
    if (index === 0){
      initialState = line.replace('initial state: ', '');
    }

    if (line.length === 0){
      return;
    }

    const [lhs, rhs] = line.split(' => ');
    //keep only the rules that implicates in the plant surviving
    if (rhs === '#'){
      rules.add(lhs);
    }
  });

  return {
    initialState,
    rules
  }
}

function shouldBeAlive(state, rules, index){
  let plantArea = '';
  for (i = -2; i <= 2; i++){
    //handle border cases
    if (index + i < 0 || index + i >= state.length){
      plantArea += '.';
    } else {
      plantArea += state[index+i];
    }
  }

  return rules.has(plantArea);
}

function run(initialState, rules, generations) {
  const seenStates = new Map();
  const nextStates = [];
  let state = initialState;
  
  //include some pots at the edges
  const additionaPots = 15000;
  let pots = new Array(additionaPots).fill('.').join('');
  state = pots + state + pots;
  leftMostIndex = -additionaPots;
  
  nextStates.push(state);

  // console.log(`0: ${state}`);
  for (let i = 0; i < generations; i++){
    //if we reach this point, we will not be in a loop
    //no need to keep iterating over the states
    if (seenStates.has(state)){
      const amountStates = nextStates.length;
      const nextStatePosition = seenStates.get(state);
      const delta = amountStates - nextStatePosition;

      const missingIterations = generations - i;
      const finalStatePosition = nextStatePosition + (missingIterations % delta) - 1;
      state = nextStates[finalStatePosition];
      break;
    }
    
    let newState = '';
    for (let j = 0; j < state.length; j++){
      if (shouldBeAlive(state, rules, j)){
        newState += '#';
      } else {
        newState += '.';
      }
    }

    //add the position of the seen state in the array
    nextStates.push(newState);
    seenStates.set(state, nextStates.length-1);

    state = newState;
    // console.log(`${i+1}: ${state}`);
  }

  let sumPotsContainingPlants = 0;
  state.split('').forEach((plant, index) => {
    if (plant === '#'){
      sumPotsContainingPlants += index + leftMostIndex;
    }
  });
  return sumPotsContainingPlants
}

const start = new Date();

const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();
const parsedInput = parse(input);

console.log(`Part 1: ${run(parsedInput.initialState, parsedInput.rules, 20)}`);
console.log(`Part 2: ${run(parsedInput.initialState, parsedInput.rules, 50000000000)}`);

const elapsed = new Date() - start;
console.log(`Total time: ${elapsed}ms`);

