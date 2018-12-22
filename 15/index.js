const fs = require('fs');

class Unit {
  constructor(type='G'){
    this._type = type;
    this._hitPoints = 200;
    this._attackPower = 3;
  }

  _getEnemiesInRange(){

  }

  play(){
    //tires to move into range of an enemy and then attack

    //identify all possible targets

    //identify open squares in range of each target

    //if not in range and no open squares, end its turn
  }

  move(){
    //eliminate unreachable squres

    //find the nearest squares

    //calculate path to them and pick the shortes. If more than one, consider reading order of the first
    //step of each path
  }

  attack(){
    //identify units adjacent to it. if none available, end its turn

    //select adjacent unit with fewest hit points

    //damage = attack power

    //if unit that took damage ends up with hitpoints <= 0, it dies and square becomes '.'
  }
}

class Game {
  constructor(fileName){
    this._units = [];

    this._createMap(fileName);
  }

  _createMap(fileName){
    this._map = [];

    const input = fs.readFileSync(fileName).toString();
    input.split('\r\n').forEach((line, rowIdx) => {
      const row = [];

      for (let colIdx = 0; colIdx < line.length; colIdx++){
        const char = line[colIdx];
        row.push(char);
        
        if (char === 'G' || char === 'E') {
          this._units.push(new Unit({
            type: char,
            pos: [rowIdx, colIdx]
          }));
        }
      }

      this._map.push(row);
    });
  }

  printMap(){
    for (let row = 0; row < this._map.length; row++) {
      for (let col = 0; col < this._map[row].length; col++){
        process.stdout.write(this._map[row][col]);
      }
      process.stdout.write('\n');
    }
  }

  _sortUnits(){
    this._units.sort((u1,u2) => {
      if (u1.position[0] < u2.position[0]){
        return -1;
      }
      if (u1.position[0] === u2.position[0] && u1.position[1] < u2.position[1]){
        return -1;
      }

      return 1;
    });
  }

  start() {
    this._sortUnits();

    this.units.forEach(unit => {
      unit.play();
    });
  }
}

const game = new Game('sample_input.txt');
game.printMap();