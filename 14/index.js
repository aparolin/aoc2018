const input = 9;

//double linked list
class Board {
  constructor(score){

    if (score){
      this.head = score;
      this.tail = score;
      this.size = 1;
    } else {
      this.head = null;
      this.tail = null;
      this.size = 0;
    }
  }

  appendAt(pos, newScore){
    if (pos >= this.size) {
      throw new Error(`Specified pos=${pos} greater or equal than list size: ${this.size}`);
    }

    if (pos < 0){
      throw new Error(`pos argument must be a positive integer. Specified pos=${pos} is negative`);
    }

    let score = this.head;
    for (let i = 0; i < pos; i++){
      score = score.next;
    }

    newScore.prev = score.prev;
    newScore.next = score;

    if (score.prev){
      score.prev.next = newScore;
    } else {
      this.head = newScore;
    }

    if (score.next){
      score.next.prev = newScore;
    } else {
      this.tail = newScore;
    }
    
  }

  append(newScore) {
    if (!(newScore instanceof Score)){
      throw new Error('newScore must be of type Score');
    }

    if (this.size === 0){
      this.head = newScore;
      this.tail = newScore;
    } else {
      newScore.prev = this.tail;
      this.tail.next = newScore;
      this.tail = newScore;
    }

    this.size++;
  }

  getScoreAt(pos, initialScore=this.head){
    let score = initialScore;

    for (let i = 0; i < pos; i++){
      if (!score.next){
        score = this.head;
      } else {
        score = score.next;
      }
    }

    return score;
  }

  print(){
    let score = this.head;
    while (score){
      process.stdout.write(`${score.value} `);
      score = score.next;
    }
    process.stdout.write('\n');
  }

  part1(recipes){
    let result = '';
    let score = this.getScoreAt(recipes);
    for (let i = 0; i < 10; i++){
      result += score.value.toString();
      score = score.next;
    }
    return result;
  }
}

//nodes of the list
class Score{
  constructor(value){
    this.value = parseInt(value, 10);
    this.prev = null;
    this.next = null;
  }
}

const numberElves = 2;
const elves = [];
const initialScores = [3, 7];
const board = new Board();
for (let i = 0; i < numberElves; i++){
  const newScore = new Score(initialScores[i])
  elves.push({
    pos: i,
    score: newScore
  });

  board.append(newScore);
}

const numberRecipes = 894501;
for (let i = 0; i < numberRecipes+10; i++){
  // board.print();

  //create new recipe
  const newRecipe = elves.reduce((acc, elf) => acc + elf.score.value, 0);
  newRecipe.toString().split('').forEach(char => {
    board.append(new Score(char));
  });

  //walk the elves
  elves.forEach(elf => {
    const stepsToTheRight = elf.score.value + 1;
    elf.score = board.getScoreAt(stepsToTheRight, elf.score);
  });
}

console.log(`Part 1:${board.part1(numberRecipes)}`);




