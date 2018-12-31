const registers = new Array(4).fill(0);

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
  const {opCode, a, b, c} = parse(instruction);
  
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

function parse(instruction){
  const [opCode, a, b, c] = instruction.split(' ').map(t => parseInt(t));
  return {opCode, a, b, c};
}

function part1(lines, ops){
  function parseBeforeAfter(s){
    return s.match(/\[(.*)\]/)[1].split(', ').map(i => parseInt(i));
  }

  //execute the instructions in blocks of 3
  let validSamples = 0;
  for (let i = 0; i < lines.length; i+=4){
      const before = parseBeforeAfter(lines[i]);
      const instruction = lines[i+1];
      const after = parseBeforeAfter(lines[i+2]);

      let validOperations = 0;
      ops.forEach(op => {
        if (testOp(op, instruction, before, after)) {
          validOperations++;
        }
      });

      if (validOperations >= 3){
        validSamples++;
      }
  }

  return validSamples;
}

const input = require('fs').readFileSync('input1.txt').toString().split('\r\n');
const ops = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

console.log(`Part 1: ${part1(input, ops)}`);