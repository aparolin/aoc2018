const Game = require('./game/Game.js');

const fileName = process.argv[2];
const debugMode = process.argv.includes('-d');

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
  let attackPower = 3;
  while (true) {
    let game = new Game(fileName, {
      E: {
        attackPower
      }
    });
    let matchResults = game.run(debugMode);

    console.log(matchResults);
    if (matchResults.losses.E === 0){
      // console.log(`Part 2: ${matchResults.part1} with attack of ${attackPower}`);
      break;
    }

    attackPower++;
  }
}

part1();
part2();
