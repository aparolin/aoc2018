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
  let state = initialState;
  
  let leftMostIndex = 0;

  // console.log(`0: ${state}`);
  for (let i = 0; i < generations; i++){
    //add aditional plant to the beginning
    if (state[0] === '#' || state[1] === '#'){
      state = '.' + state;
      leftMostIndex--;
    }

    //add aditional plants at the end
    if (state[state.length-2] === '#' || state[state.length-1] === '#'){
      state = state + '.'
    }

    let newState = '';
    for (let j = 0; j < state.length; j++){
      if (shouldBeAlive(state, rules, j)){
        newState += '#';
      } else {
        newState += '.';
      }
    }

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

function part2(){
  /*
  The next algorithm was deduced empirically. By printing around 200 generations of plants, the pattern below can be seen prepended by lots of empty pots.
  In generation=185, the first plant is prepended by 145 empty spots and the leftMostIndex=-3. In each iteration, the pattern move one to the right, but the leftMostIndex stay the same.
  By following the above logic, the end result can be determined as follows.
  */
  const pattern = '##..#......##..#......##..#......##..#......##..#....##..#.......##..#......##..#....##..#.....##..#......##..#......##..#....##..#....##..#';
  //185-145 = 40
  const index = 50000000000-40;
  
  let sum = 0;
  for (let i = 0; i < pattern.length; i++){
    if (pattern[i] === '#'){
      //-3 because of the leftMostIndex
      sum += index + i -3
    }
  }
  return sum;
}

const start = new Date();

const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();
const parsedInput = parse(input);

console.log(`Part 1: ${run(parsedInput.initialState, parsedInput.rules, 20)}`);
console.log(`Part 2: ${part2()}`);

const elapsed = new Date() - start;
console.log(`Total time: ${elapsed}ms`);