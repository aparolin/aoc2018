const Game = require('./game');

const fileName = process.argv[2];

if (!fileName){
  console.log('No filename provided!');
  console.log('Usage: node index.js [fileName]');
  process.exit(1);
}

const game = new Game(fileName);
const debugMode = process.argv.includes('-d');
const matchResults = game.run(debugMode);

console.log(`Part 1: ${matchResults.part1}`);