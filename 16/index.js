function addr(a, b, c){
  registers[c] = registers[a] + registers[b];
}

function addi(a, b, c){
  registers[c] = registers[a] + b;
}

function mulr(a, b, c){
  registers[c] = registers[a] * registers[b];
}

function muli(a, b, c){
  registers[c] = registers[a] * b;
}

function banr(a, b, c){
  registers[c] = registers[a] & registers[b];
}

function bani(a, b, c){
  registers[c] = registers[a] & b;
}

function borr(a, b, c){
  registers[c] = registers[a] | registers[b];
}

function bori(a, b, c){
  registers[c] = registers[a] | b;
}

function setr(a, b, c){
  registers[c] = registers[a];
}

function seti(a, b, c){
  registers[c] = a;
}

function gtir(a, b, c){
  if (a > registers[b]){
    registers[c] = 1;
  } else {
    registers[c] = 0;
  }
}

function gtri(a, b, c){
  if (registers[a] > b){
    registers[c] = 1;
  } else {
    registers[c] = 0;
  }
}

function gtrr(a, b, c){
  if (registers[a] > registers[b]){
    registers[c] = 1;
  } else {
    registers[c] = 0;
  }
}

function eqir(a, b, c){
  if (a === registers[b]) {
    registers[c] = 1;
  } else {
    registers[c] = 0;
  }
}

function eqri(a, b, c){
  if (registers[a] === b){
    registers[c] = 1;
  } else {
    registers[c] = 0;
  }
}

function eqrr(a, b, c){
  if (registers[a] === registers[b]){
    registers[c] = 1;
  } else {
    registers[c] = 0;
  }
}

function testOp(op, instruction, before, after){
  const {opCode, a, b, c} = instruction;

  //load registers with before
  for (let i = 0; i < registers.length; i++){
    registers[i] = before[i];
  }
  
  //execute operation
  op(a, b, c);

  //check the registers
  for (let i = 0; i < registers.length; i++){
    if (registers[i] !== after[i]){
      return false;
    }
  }
  return true;
}

function parseInstruction(instruction){
  const [opCode, a, b, c] = instruction.split(' ').map(t => parseInt(t));
  return {opCode, a, b, c};
}

function part1(input, ops){
  function parseBeforeAfter(s){
    return s.match(/\[(.*)\]/)[1].split(', ').map(i => parseInt(i));
  }

  //create array to map all opCodes to each of their possible functions
  //initially, all codes are associated to all functions
  const possibleOpCodeFunctions = [];
  while (possibleOpCodeFunctions.push(ops.slice().map(f => f.name)) < ops.length);

  //execute the instructions in blocks of 3
  let validSamples = 0;
  for (let i = 0; i < input.length; i+=4){
      const before = parseBeforeAfter(input[i]);
      const instruction = parseInstruction(input[i+1]);
      const after = parseBeforeAfter(input[i+2]);

      let validOperations = 0;
      let possibleOperations = [];
      ops.forEach(op => {
        if (testOp(op, instruction, before, after)) {
          validOperations++;

          possibleOperations.push(op.name);
        }
      });

      //possible operations = previous possible with the intersection of the current possible ones
      let intersectionPossibleOperations = [];
      for (operationName of possibleOperations){
        if (possibleOpCodeFunctions[instruction.opCode].includes(operationName)){
          intersectionPossibleOperations.push(operationName);
        }
      }
      possibleOpCodeFunctions[instruction.opCode] = intersectionPossibleOperations;

      if (validOperations >= 3){
        validSamples++;
      }
  }

  //backtracking algorithm using DPS

  //initial nodes are the codes that we are sure can only be assigned to a single function
  const nodes = [];
  possibleOpCodeFunctions.forEach((ops, index) => {
    if (ops.length === 1){
      nodes.push({
        opCode: index,
        opName: ops[0],
        solvedOps: [ops[0]],
        solvedCodes: [index],
        previous: null
      });
    }
  });

  const opCodeFunctionMapping = new Array(ops.length);
  while (nodes.length > 0){
    let currentNode = nodes.pop();

    //are we done?
    if (currentNode.solvedOps.length === ops.length){
      //fill up the mapping
      while (currentNode){
        opCodeFunctionMapping[currentNode.opCode] = eval(currentNode.opName);
        currentNode = currentNode.previous;
      }

      break;
    }

    //check the possible values for the next opCode
    let possibleNextNodes = possibleOpCodeFunctions[(currentNode.opCode + 1) % possibleOpCodeFunctions.length].map(op => {
      return {
        opCode: (currentNode.opCode + 1) % possibleOpCodeFunctions.length,
        opName: op
      }
    });

    for (let i = 0; i < possibleNextNodes.length; i++){
      //if the next node will contain an already checked function name, we don't include it
      //prunning
      if (!currentNode.solvedOps.includes(possibleNextNodes[i].opName) &&
          !currentNode.solvedCodes.includes(possibleNextNodes[i].opCode)){
        let next = {
          opCode: possibleNextNodes[i].opCode,
          opName: possibleNextNodes[i].opName,
          solvedOps: currentNode.solvedOps.slice(),
          solvedCodes: currentNode.solvedCodes.slice(),
          previous: currentNode
        };
        next.solvedOps.push(possibleNextNodes[i].opName);
        next.solvedCodes.push(possibleNextNodes[i].opCode);
        nodes.push(next);
      }
    }
  }

  return {
    validSamples,
    opCodeFunctionMapping
  };
}

function part2(input, codeOpMapping){
  for (let i = 0; i < registers.length; i++){
    registers[i] = 0;
  }

  let i = 0;
  input.forEach(instruction => {
    console.log(instruction);
    const {opCode, a, b, c} = parseInstruction(instruction);
    
    //execute function
    codeOpMapping[opCode](a, b, c);
    i++;
  });

  return registers[0];
}

const fs = require('fs');
const inputs = ['input1.txt','input2.txt'].map(fileName => {
  return fs.readFileSync(fileName).toString().split('\r\n');
})
const ops = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

const registers = new Array(4).fill(0);

const resultPart1 = part1(inputs[0], ops);
console.log(`Part 1: ${resultPart1.validSamples}`);
console.log(`Part 2: ${part2(inputs[1], resultPart1.opCodeFunctionMapping)}`);
