class Unit {
  constructor(type='G', pos, game, attributes = {}){
    const defaultAttr = {
      hp: 200,
      attackPower: 3
    };

    const attr = Object.assign(defaultAttr, attributes[type] || {});

    this._pos = pos;
    this._type = type;
    this._hp = attr.hp;
    this._attackPower = attr.attackPower;
    this._game = game;
  }

  get pos(){
    return this._pos;
  }

  get type(){
    return this._type;
  }

  get hp(){
    return this._hp;
  }

  set hp(newHP){
    this._hp = newHP;

    if (this._hp <= 0){
      this._die();
    }
  }

  get attackPower(){
    return this._attackPower;
  }

  _die(){
    this._game.map[this.pos[0]][this.pos[1]] = '.';
    this._game.drop(this);
  }

  play(){
    let enemies = this._game.getEnemiesPositions(this);

    if (enemies.inAttackRange.length === 0){
      this._move(enemies.others);
    }

    enemies = this._game.getEnemiesPositions(this);
    this._attack(enemies.inAttackRange);
  }

  _move(enemies){
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
      if (alreadyVisited.has(neighbor.pos.join(','))){
        continue;
      }

      alreadyVisited.add(neighbor.pos.join(','));

      if (targets.has(neighbor.pos.join(','))){
        paths.push(neighbor);
      }

      if (paths.length === targets.size){
        break;
      }

      this._game.availableSpacesAroundPosition(neighbor.pos).forEach(n => {
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

  _attack(enemies){
    if (enemies.length === 0){
      return;
    }

    //Sort by hp. If it's the same, sort by reading order
    enemies.sort((e1, e2) => {
      if (e1.hp === e2.hp){
        if (e1.pos[0] < e2.pos[0]){
          return -1;
        }
        if (e1.pos[0] === e2.pos[0] && e1.pos[1] < e2.pos[1]){
          return -1;
        }
      }

      return e1.hp - e2.hp;
    });

    const enemy = enemies[0];
    enemy.hp -= this.attackPower;
  }
}

module.exports = Unit;