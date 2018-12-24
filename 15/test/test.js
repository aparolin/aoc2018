const test = require('tape');

const Game = require('../game');

test('Run with input.txt', t => {
  const game = new Game('./inputs/input.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 222831);
  t.end();
});

test('Run sample move', t => {
  const game = new Game('./inputs/sample_move.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 27828);
  t.end();
});

test('Run sample attack', t => {
  const game = new Game('./inputs/sample_attack.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 27730);
  t.end();
});

test('Run sample input 1', t => {
  const game = new Game('./inputs/input1.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 36334);
  t.end();
});

test('Run sample input 2', t => {
  const game = new Game('./inputs/input2.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 39514);
  t.end();
});

test('Run sample input 3', t => {
  const game = new Game('./inputs/input3.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 27755);
  t.end();
});

test('Run sample input 4', t => {
  const game = new Game('./inputs/input4.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 28944);
  t.end();
});

test('Run sample input 5', t => {
  const game = new Game('./inputs/input5.txt');
  const matchResults = game.run();

  t.equal(matchResults.part1, 18740);
  t.end();
});