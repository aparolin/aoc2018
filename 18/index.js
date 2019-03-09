const fs = require('fs');

function parseLine(line) {
  let minRow = maxRow = minCol = maxCol = 0;
  const re1 = /x=(\d+), *?y=(\d+)..(\d+)/;
  const re2 = /y=(\d+), *?x=(\d+)..(\d+)/;

  let groups = line.match(re1);
  if (groups){
    minCol = maxCol = groups[1];
    minRow = groups[2];
    maxRow = groups[3];
  } else {
    groups = line.match(re2);
    minRow = maxRow = groups[1];
    minCol = groups[2];
    maxCol = groups[3];
  }

  return { minCol: +minCol, maxCol: +maxCol, minRow: +minRow, maxRow: +maxRow };
}

function readTerrain() {
  const clayPos = new Set();
  const lines = fs.readFileSync('input.txt').toString().split('\r\n');
  let ulRow = ulCol = Infinity;
  let brRow = brCol = -Infinity;
  lines.forEach(line => {
    const { minCol, maxCol, minRow, maxRow } = parseLine(line);
    for (let row = minRow; row <= maxRow; row++){
      for (let col = minCol; col <= maxCol; col++){
        clayPos.add([row, col].join(','));
        
        if (row < ulRow){
          ulRow = row;
        }
        if (row > brRow) {
          brRow = row;
        }
        if (col < ulCol) {
          ulCol = col;
        }
        if (col > brCol) {
          brCol = col;
        }
      }
    }
  });

  return {
    clayPos,
    borders: [[ulRow, ulCol], [brRow, brCol]],
    waterPos: [0, 500]
  };
}

function produceWater(amount, terrain) {
  
}

function part1() {
  const terrain = readTerrain();
  // const wetPos = produceWater(10, terrain);
  // console.log(wetPos);
  console.log(terrain);
}

part1();