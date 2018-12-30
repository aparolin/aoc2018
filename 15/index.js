const Game = require('./game/Game.js');

const fileName = process.argv[2];
const debugMode = process.argv.includes('-d');

const p1 = process.argv.includes('-p1');
const p2 = process.argv.includes('-p2');

if (!fileName){
  console.log('No filename provided!');
  console.log('Usage: node index.js [fileName]');
  process.exit(1);
}

function part1(){
  const game = new Game(fileName);
  const matchResults = game.run(debugMode);
  
  console.log(`Part 1: ${matchResults.part1}`);
}

function part2(){
  let attackPower = 4;
  while (true) {
    if (debugMode){
      console.log(`Starting game with elf attack=${attackPower}`);
    }
    let game = new Game(fileName, {
      E: {
        attackPower
      }
    });
    let matchResults = game.run(debugMode);

    if (matchResults.losses.E === 0){
      console.log(`Part 2: ${matchResults.part1}`);
      break;
    }

    attackPower++;
  }
}

if (p1){
  part1();
}
if (p2){
  part2();
}
