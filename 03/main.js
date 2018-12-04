const start = new Date();

const fs = require('fs');

const inputString = fs.readFileSync('input.txt').toString();
const claims = inputString.split('\r\n');

const re= /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;

let fabric = [];
let areas = new Map();
const size = 1000;
for (let row = 0; row < size; row++){
  fabric.push(new Array(size).fill('.'));
}

claims.forEach((claim, iter) => {
  const tokens = re.exec(claim);

  let id = +tokens[1];
  let left = +tokens[2];
  let top = +tokens[3];
  let width = +tokens[4];
  let height = +tokens[5];

  //store the area of that claim for part 2
  areas.set(id, height * width);

  for (let row = top; row < top + height; row++){
    for (let col = left; col < left + width; col++){
      if (fabric[row][col] !== '.'){
        fabric[row][col] = 'X';
      } else {
        fabric[row][col] = id;
      }
    }
  }

});

let overlap = 0;
fabric.forEach(line => {
  overlap += line.reduce((acc, el) => acc + (el === 'X' ? 1 : 0) ,0);
});
console.log(`Part 1: ${overlap}`);

for (let [id, area] of areas){
  let areaOnFabric = 0;
  fabric.forEach(line => {
    areaOnFabric += line.reduce((acc, el) => acc + (el === id ? 1: 0), 0);
  });
  if (areaOnFabric === area){
    console.log(`Part 2: ${id}`);
    break;
  }
}

const elapsed = new Date() - start;
console.log(`Execution time: ${elapsed}ms`);