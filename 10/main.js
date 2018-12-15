function parseLine(line) {
  const re = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/
  const tokens = line.match(re);
  return [+tokens[1], +tokens[2], +tokens[3], +tokens[4]];
}

function update(points) {  
  const newPoints = new Map();
  points.forEach((bucket, key) => {
    const updatedPoints = [];
    bucket.forEach(point => {
      point.position[0] += point.velocity[0];
      point.position[1] += point.velocity[1];
  
      updatedPoints.push(point);
    });
    
    updatedPoints.forEach(point => {
      const newKey = `${point.position[0]},${point.position[1]}`;
      if (newPoints.has(newKey)){
        newPoints.get(newKey).push(point);
      } else {
        newPoints.set(newKey, [point]);
      }
    })
  });

  return newPoints;
}

function print(points){
  let minX = minY = Infinity;
  let maxX = maxY = -Infinity;
  points.forEach(bucket => {
    bucket.forEach(p => {
      if (p.position[0] < minX) {
        minX = p.position[0];
      }
  
      if (p.position[0] > maxX) {
        maxX = p.position[0];
      }
  
      if (p.position[1] < minY) {
        minY = p.position[1];
      }
  
      if (p.position[1] > maxY) {
        maxY = p.position[1];
      }
    });
  });

  for (let y = minY; y <= maxY; y++){
    for (let x = minX; x <= maxX; x++){
      const key = `${x},${y}`;
      if (points.has(key)){
        process.stdout.write('#');
      } else {
        process.stdout.write('.');
      }

    }
    process.stdout.write('\n');
  }


  process.stdout.write('\n\n\n\n');
}

function formSentence(points){
  //check if every point has a neighbor
  for (let key of points.keys()){
    let hasNeighbor = false;
    const coordinates = key.split(',');
    const [pX, pY] = coordinates.map(c => parseInt(c));

    for (let x = -1; x <= 1; x++){
      for (let y = -1; y <= 1; y++){
        const newKey = `${pX+x},${pY+y}`;
        if (newKey === key){
          continue;
        }

        if (points.has(newKey)){
          hasNeighbor = true;
          break;
        }
      }

      if (hasNeighbor){
        break;
      }
    }

    if (!hasNeighbor){
      return false;
    }
  }

  return true;
}

const start = new Date();
const fs = require('fs');

const input = fs.readFileSync('input.txt').toString();

let points = new Map();
let id = 0;
input.split('\r\n').forEach(line => {
  const tokens = parseLine(line);
  const position = [tokens[0], tokens[1]];
  const velocity = [tokens[2], tokens[3]];

  const key = `${position[0]},${position[1]}`;
  const newPoint = {
    id: id++,
    position,
    velocity
  };
  if (!points.has(key)){
    points.set(key, [newPoint]);
  } else {
    points.get(key).push(newPoint);
  }
});

let seconds = 0;
while (!formSentence(points)){
  points = update(points);
  seconds++;
}

console.log('Part 1:');
print(points);
console.log(`Part 2: ${seconds}`);

const elapsed = new Date() - start;
console.log(`Total time: ${elapsed}ms`);