const fs = require('fs');

class Unit {
  constructor(type='G', pos, game){
    this._pos = pos;
    this._type = type;
    this._hitPoints = 200;
    this._attackPower = 3;
    this._game = game;
  }

  get pos(){
    return this._pos;
  }

  get type(){
    return this._type;
  }

  play(){
    //tires to move into range of an enemy and then attack

    const enemies = this._game.getEnemiesPositions(this);
    if (enemies.inAttackRange.length > 0){
      this._attack(enemies);
    } else {
      this._move(enemies.others);
    }

    //identify all possible targets

    //identify open squares in range of each target

    //if not in range and no open squares, end its turn
  }

  _move(enemies){
    console.log(`Unit at ${this._pos[0]},${this._pos[1]} will move`);
    const paths = this._getPathsToEnemies(enemies);
    
    //no path available to reach the enemies
    if (paths.length === 0){
      return;
    }

    const targetNode = paths[0];
    //find the nextStep towards the targetNode
    let nextStep = targetNode;
    while (nextStep.previous){
      nextStep = nextStep.previous;
    }

    this._game.map[this.pos[0]][this.pos[1]] = '.';
    this._game.map[nextStep.pos[0]][nextStep.pos[1]] = this.type;

    this._pos = nextStep.pos;
  }

  _getPathsToEnemies(enemies){
    const targets = new Set();
    enemies.forEach(enemy => {
      this._game.availableSpacesAroundPosition(enemy.pos).forEach(position => {
        targets.add(position.join(','));
      })
    });

    //BFS to find the positions
    const alreadyVisited = new Set();
    const neighbors = this._game.availableSpacesAroundPosition(this.pos).map(n => {
      return {
        pos: n,
        distance: 1,
        previous: null
      }
    });
    const paths = [];
    while (neighbors.length > 0){
      let neighbor = neighbors.shift();
      alreadyVisited.add(neighbor.pos.join(','));

      if (targets.has(neighbor.pos.join(','))){
        paths.push(neighbor);
      }

      this._game.availableSpacesAroundPosition(neighbor.pos).forEach(n => {
        if (alreadyVisited.has(n.join(','))){
          return;
        }

        neighbors.push({
          pos: n,
          distance: neighbor.distance + 1,
          previous: neighbor
        });
      });
    }

    paths.sort((p1,p2) => {
      if (p1.distance < p2.distance){
        return -1;
      }

      //next step is the relevant one
      while (p1.previous){
        p1 = p1.previous;
      }
      while (p2.previous){
        p2 = p2.previous;
      }
      
      if (p1.pos[0] < p2.pos[0]){
        return -1;
      }
      if (p1.pos[0] === p2.pos[0] && p1.pos[1] < p2.pos[1]){
        return -1;
      }

      return 1;
    });
    return paths;
  }

  _attack(){
    console.log(`Unit at ${this._pos[0]},${this._pos[1]} will attack`);
    //identify units adjacent to it. if none available, end its turn

    //select adjacent unit with fewest hit points

    //damage = attack power

    //if unit that took damage ends up with hitpoints <= 0, it dies and square becomes '.'
  }
}

class Game {
  constructor(fileName){
    this._units = [];
    this.map = null;

    this._createMap(fileName);
  }

  _createMap(fileName){
    this.map = [];

    const input = fs.readFileSync(fileName).toString();
    input.split('\r\n').forEach((line, rowIdx) => {
      const row = [];

      for (let colIdx = 0; colIdx < line.length; colIdx++){
        const char = line[colIdx];
        row.push(char);
        
        if (char === 'G' || char === 'E') {
          this._units.push(new Unit(char, [rowIdx, colIdx], this));
        }
      }

      this.map.push(row);
    });
  }

  printMap(){
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++){
        process.stdout.write(this.map[row][col]);
      }
      process.stdout.write('\n');
    }
  }

  _sortUnits(){
    // this._sortPositionsArray(this._units);

    this._units.sort((u1,u2) => {
      if (u1.pos[0] < u2.pos[0]){
        return -1;
      }
      if (u1.pos[0] === u2.pos[0] && u1.pos[1] < u2.pos[1]){
        return -1;
      }

      return 1;
    });
  }

  availableSpacesAroundPosition(pos){
    const availableSpaces = [];
    for (let colOffset = -1; colOffset <=1; colOffset+=2){
      const newCol = pos[1] + colOffset;
      const row = pos[0];
      if (newCol >= 0 && newCol < this.map[0].length && this.map[row][newCol] === '.'){
        availableSpaces.push([row, newCol]);
      }
    }
    for (let rowOffset = -1; rowOffset <=1; rowOffset+=2){
      const newRow = pos[0] + rowOffset;
      const col = pos[1];
      if (newRow >= 0 && newRow < this.map.length && this.map[newRow][col] === '.'){
        availableSpaces.push([newRow, col]);
      }
    }
    return availableSpaces;
  }

  getEnemiesPositions(unit) {
    const enemies = {
      inAttackRange: [],
      others: []
    }

    this._units.forEach(other => {
      if (unit === other || unit.type === other.type) {
        return;
      }

      //ignore diagonally adjascent enemies
      if ((other.pos[0] === unit.pos[0]-1 && other.pos[1] === unit.pos[1]) || 
          (other.pos[0] === unit.pos[0]+1 && other.pos[1] === unit.pos[1]) ||
          (other.pos[0] === unit.pos[0] && other.pos[1] === unit.pos[1]-1) || 
          (other.pos[0] === unit.pos[0] && other.pos[1] === unit.pos[1]+1)){
          enemies.inAttackRange.push(other);
        } else {
          enemies.others.push(other);
        }
    });

    return enemies;
  }

  start() {
    this._sortUnits();

    for (let i = 0; i < 3; i++){
      this._units.forEach(unit => {
        unit. play();
      });
      
      this.printMap();
    }
  }
}

const game = new Game('sample_move.txt');
game.printMap();
game.start();