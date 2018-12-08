const fs = require('fs');

const start = new Date();

function react(unit1, unit2){
  String.fromCharCode('A'.charCodeAt(0) + 32)


  if ((unit1.charCodeAt(0) === unit2.charCodeAt(0) + 32) || (unit1.charCodeAt(0) + 32 === unit2.charCodeAt(0))){
    return true;
  }
  return false;
}


function removeConflicts(input){
  let result = input.substr(0,2);
  for (let i = 2; i < input.length; i++){
    if (result.length < 2){
      result += input[i];
      continue;
    }
    
    if (react(result[result.length-1], result[result.length-2])){
      result = result.substr(0, result.length-2);
    }
    
    result += input[i];
  }
  
  return result;
}

const polymer = fs.readFileSync('input.txt').toString();

let minLength = Infinity; 
for (var i = 65; i <= 90; i++){
  polymersToBeRemoved = [String.fromCharCode(i), String.fromCharCode(i+32)];
  let newPolymer = polymer.replace(new RegExp(polymersToBeRemoved[0] + "|" + polymersToBeRemoved[1],'g'),'');

  let reactedPolymer = removeConflicts(newPolymer);
  if (reactedPolymer.length < minLength){
    minLength = reactedPolymer.length;
  }
}

console.log(`Part 1: ${removeConflicts(polymer).length}`);
console.log(`Part 2: ${minLength}`);

const elapsed = new Date() - start;
console.log(`Elapsed time: ${elapsed}ms`);