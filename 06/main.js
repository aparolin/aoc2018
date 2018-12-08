const fs = require('fs');

const inputString = fs.readFileSync('input.txt').toString();
const coordinates = inputString.split('\r\n');

function manhattanDistance(p0, p1){
  return Math.abs(p0[0] - p1[0]) + Math.abs(p0[1] - p1[1]);
}

const points = new Map();
let id = 1;
let x0 = y0 = Infinity;
let x1 = y1 = -Infinity;
coordinates.forEach(coordinate => {
  let [x, y] = coordinate.split(", ");
  x = parseInt(x);
  y = parseInt(y);

  points.set(id, [x, y]);

  if (x <= x0){
    x0 = x;
  }
  if (y <= y0){
    y0 = y;
  }

  if (x >= x1){
    x1 = x;
  }
  
  if (y >= y1){
    y1 = y
  }

  id++;
});

const areas = new Map();
const maxSum = 10000;
let regionSize = 0;
for (let y = y0; y <= y1; y++){
  for (let x = x0; x <= x1; x++){
    let curCoord = [x, y];

    //find the closest point to current coordinate
    let distances = [];

    points.forEach((point, id) => {
      distances.push({
        distance: manhattanDistance(curCoord, point),
        id
      });
    });

    let sumOfDistances = distances.reduce((acc, distance) => {
      return acc + distance.distance;
    }, 0);
    if (sumOfDistances < maxSum){
      regionSize++;
    }

    distances.sort((a, b) => a.distance - b.distance);
    //ignore points that are the same distance to multiple points
    if (distances[0].distance === distances[1].distance){
      continue;
    }
    let closestPointId = distances[0].id;

    //borders
    if (x === x0 || x === x1 || y === y0 || y === 1){
      areas.set(closestPointId, Infinity);
      continue;
    }

    if (!areas.has(closestPointId)){
      areas.set(closestPointId, 1);
    } else {
      areas.set(closestPointId, areas.get(closestPointId) + 1);
    }
  }
}

let largestArea = -1;
areas.forEach(area => {
  if (area !== Infinity && area > largestArea){
    largestArea = area;
  }
});

console.log(`Part 1: ${largestArea}`);
console.log(`Part 2: ${regionSize}`);