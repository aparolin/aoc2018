const fs = require('fs');
const Unit = require('./Unit.js');

class Game {
  constructor(fileName, unitAttributes){
    this._unitAttr = unitAttributes;
    this._units = [];
    this._aliveUnits = {
      G: 0,
      E: 0
    }
    this.map = [];
    this._unitsToBeEliminated = new Set();

    this._createMap(fileName);
  }

  _createMap(fileName){
    const input = fs.readFileSync(fileName).toString();
    input.split('\r\n').forEach((line, rowIdx) => {
      const row = [];

      for (let colIdx = 0; colIdx < line.length; colIdx++){
        const char = line[colIdx];
        row.push(char);
        
        if (char === 'G' || char === 'E') {
          this._units.push(new Unit(char, [rowIdx, colIdx], this, this._unitAttr));
          this._aliveUnits[char]++;
        }
      }

      this.map.push(row);
    });
  }

  printMap(){
    let unitsInRow = [];
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++){
        process.stdout.write(this.map[row][col]);

        if (this.map[row][col] === 'G' || this.map[row][col] === 'E'){
          const unit = this._units.find(u => {
            return u.pos[0] === row && u.pos[1] === col;
          });
          unitsInRow.push(unit);
        }
      }

      process.stdout.write('\t');
      unitsInRow.forEach(u => {
        process.stdout.write(`${u.type}(${u.hp}@${u.pos[1]},${u.pos[0]}),`);
      });
      unitsInRow = [];

      process.stdout.write('\n');
    }
  }

  _sortPositionsArray(array){
    array.sort((p1,p2) => {
      if (p1.pos[0] < p2.pos[0]){
        return -1;
      }
      if (p1.pos[0] === p2.pos[0] && p1.pos[1] < p2.pos[1]){
        return -1;
      }

      return 1;
    });
  }

  _sortUnits(){
    this._sortPositionsArray(this._units);
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

    availableSpaces.sort((p1,p2) => {
      if (p1[0] < p2[0]){
        return -1;
      }
      if (p1[0] === p2[0] && p1[1] < p2[1]){
        return -1;
      }

      return 1;
    });
    return availableSpaces;
  }

  getEnemiesPositions(unit) {
    const enemies = {
      inAttackRange: [],
      others: []
    }

    this._units.forEach(other => {
      if (this._unitsToBeEliminated.has(other)){
        return;
      }
      
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

  drop(unit){
    this._unitsToBeEliminated.add(unit);
    this._aliveUnits[unit.type]--;

    // this._matchResults.losses[unit.type]++;
  }

  _gameFinished(){
    return this._aliveUnits.G === 0 || this._aliveUnits.E === 0;
  }

  _cleanupUnits(){
    this._unitsToBeEliminated.forEach(unit => {
      let i = 0;
      for (i = 0; i < this._units.length; i++){
        if (this._units[i] === unit){
          break;
        }
      }
      this._matchResults.losses[this._units[i].type]++;
      this._units.splice(i, 1);
    });
  }
  
  run(debugMode=false) {
    if (debugMode){
      console.log('Initial state');
      this.printMap();
      console.log();
    }

    let completedRounds = 0;
    let finished = false;

    this._matchResults = {
      part1: -1,
      completedRounds: 0,
      losses: {
        E: 0,
        G: 0
      }
    };

    while (!finished){
      this._unitsToBeEliminated.clear();

      this._sortUnits();
      this._units.forEach((unit, unitIdx) => {
        if(finished){
          return;
        }

        if (this._unitsToBeEliminated.has(unit)){
          return;
        }

        unit.play();

        if (this._gameFinished()){
          finished = true;
          const sumHPRemainingUnits = this._units.reduce((sumHP, unit) => {
            if (this._unitsToBeEliminated.has(unit)){
              return sumHP;
            }
            
            return unit.hp + sumHP;
          }, 0);

          let multiplier = completedRounds;
          //this was the last unit to play anyway
          if (unitIdx === this._units.length-1){
            multiplier = completedRounds + 1;
          }

          this._matchResults.part1 = sumHPRemainingUnits * multiplier;
          this._matchResults.completedRounds = multiplier;
        }
      });
      
      completedRounds++;
      if (debugMode){
        console.log(`After ${completedRounds} round(s)`);
        this.printMap();
        console.log();
      }

      this._cleanupUnits();
    }
    
    return this._matchResults;
  }
}

module.exports = Game;