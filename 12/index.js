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

function shouldStayAlive(state, rules, index){
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
  let state = initialState;
  let leftMostIndex = 0;
  
  console.log(`0: ${state}`);
  for (let i = 0; i < generations; i++){
    //incldue some plants at the edges
    state = '..' + state + '..'
    leftMostIndex -= 2;
    
    let newState = '';
    for (let j = 0; j < state.length; j++){
      if (shouldStayAlive(state, rules, j)){
        newState += '#';
      } else {
        newState += '.';
      }
    }

    state = newState;
    console.log(`${i+1}: ${state}`);
  }

  let sumPotsContainingPlants = 0;
  state.split('').forEach((plant, index) => {
    if (plant === '#'){
      sumPotsContainingPlants += index + leftMostIndex;
    }
  });
  console.log(`Part 1: ${sumPotsContainingPlants}`);
}

const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();
const parsedInput = parse(input);
run(parsedInput.initialState, parsedInput.rules, 20);

