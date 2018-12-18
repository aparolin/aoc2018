const directions = {
  up: [-1, 0],
  right: [0, 1],
  down: [1, 0],
  left: [0, -1]
}

function isCart(char){
  return char === '^' || char === '>' || char === 'v' || char === '<';
}

function cartDirection(char){
  switch (char){
    case '^':
      return directions.up;
    case '>':
      return directions.right;
    case 'v':
      return directions.down;
    case '<':
      return directions.left;
    default:
      throw new Error(`Can't determine direction of unexpected char ${char}`);
  }
}

function parseFile(fileName){
  const fs = require('fs');
  const input = fs.readFileSync(fileName).toString();
  const lines = input.split('\r\n');
  
  let grid = [];
  const carts = [];
  for (let row = 0; row < lines.length; row++) {
    grid[row] = new Array(lines[row].length);
  
    for (let col = 0; col < lines[row].length; col++) {
      let char = lines[row][col];
      grid[row][col] = char;
  
      if (isCart(char)){
        const newCart = {
          position: [row, col],
          direction: cartDirection(char),
          turns: 0,
          turnLeft: function(){
            switch (this.direction.join(',')) {
              case directions.down.join(','):
                this.direction = directions.right;
                break;
              case directions.right.join(','):
                this.direction = directions.up;
                break;
              case directions.up.join(','):
                this.direction = directions.left;
                break;
              case directions.left.join(','):
                this.direction = directions.down;
                break;
            }
          },
          turnRight: function(){
            switch (this.direction.join(',')) {
              case directions.down.join(','):
                this.direction = directions.left;
                break;
              case directions.left.join(','):
                this.direction = directions.up;
                break;
              case directions.up.join(','):
                this.direction = directions.right;
                break;
              case directions.right.join(','):
                this.direction = directions.down;
                break;
            }
          },
          intersection: function(){
            this.turns++;
            switch (this.turns){
              case 1:
                return this.turnLeft()
              case 3:
                this.turns = 0;
                return this.turnRight();
            }
          }
        };
        carts.push(newCart);

        //do not consider the cart on the grid
        if (newCart.direction === directions.up || newCart.direction === directions.down){
          grid[row][col] = '|';
        } else {
          grid[row][col] = '-';
        }
      }
    }
  }
  
  return {
    carts,
    grid
  }  
}

function update(grid, cart){
  // const prevPos = cart.position;
  const nextPos = [cart.position[0] + cart.direction[0], cart.position[1] + cart.direction[1]];
  const nextPath = grid[nextPos[0]][nextPos[1]];
  
  cart.position = nextPos;

  let collisionCoords = null;
  switch (nextPath) {
    case '\\':
      if (cart.direction[1] === 1){
        cart.direction = directions.down;
      } else if (cart.direction[1] === -1) {
        cart.direction = directions.up;
      } else if (cart.direction[0] === -1) {
        cart.direction = directions.left;
      } else {
        cart.direction = directions.right;
      }
      break;
    case '/':
      if (cart.direction[1] === 1){
        cart.direction = directions.up;
      } else if (cart.direction[1] === -1) {
        cart.direction = directions.down;
      } else if (cart.direction[0] === -1){
        cart.direction = directions.right;
      } else {
        cart.direction = directions.left;
      }
      break;
    case '+':
      cart.intersection();
      break;
  }
}

function print(grid, carts){
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      let printCart = false;
      for (let k = 0; k < carts.length; k++){
        if (carts[k].position[0] === row && carts[k].position[1] === col){
          if (carts[k].direction[0] === -1 && carts[k].direction[1] === 0){
            process.stdout.write('^');
            printCart = true;
          }
          if (carts[k].direction[0] === 0 && carts[k].direction[1] === 1){
            process.stdout.write('>');
            printCart = true;
          }
          if (carts[k].direction[0] === 1 && carts[k].direction[1] === 0){
            process.stdout.write('v');
            printCart = true;
          }
          if (carts[k].direction[0] === 0 && carts[k].direction[1] === -1){
            process.stdout.write('<');
            printCart = true;
          }
        }
      }

      if (!printCart){
        process.stdout.write(grid[row][col]);
      }
    }
    process.stdout.write('\n');
  }
}

function run(part2 = false){
  const {carts, grid} = parseFile('input.txt');

  while (true){
    //print(grid, carts)

    //check collisions
    const cartsToBeRemoved = [];
    for (let i = 0; i < carts.length; i++){
      update(grid, carts[i]);
      
      for (let j = 0; j < carts.length; j++){
        if (i === j){
          continue;
        }
        
        if (carts[i].position[0] === carts[j].position[0] && 
          carts[i].position[1] === carts[j].position[1]){
            //invert the coords so that we get X,Y format
            if (part2) {
              cartsToBeRemoved.push(i);
              cartsToBeRemoved.push(j);
            } else {
              return `${carts[i].position[1]},${carts[i].position[0]}`;
            }
          }
      }
    }

    cartsToBeRemoved.sort();
    cartsToBeRemoved.forEach((cart, index) => {
      carts.splice(cart - index, 1);
    });

    if (carts.length === 1){
      return `${carts[0].position[1]},${carts[0].position[0]}`;
    }

    //sort carts
    carts.sort((c1,c2) => {
      if (c1.position[0] < c2.position[0]){
        return -1;
      }
      if (c1.position[0] === c2.position[0] && c1.position[1] < c2.position[1]){
        return -1;
      }

      return 1;
    });
  }
}

const start = new Date();
console.log(`Part 1: ${run()}`);
console.log(`Part 2: ${run(true)}`);

const elapsed = new Date() - start;
console.log(`Total time: ${elapsed}ms`);
