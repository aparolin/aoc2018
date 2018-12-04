const fs = require('fs');

const inputString = fs.readFileSync('input.txt').toString();
const records = inputString.split('\r\n');

parsedRecords = [];
records.forEach(record => {
  const tokens = /\[(.*)\] (.*)/.exec(record);
  const timestamp = tokens[1];
  const action = tokens[2];

  parsedRecords.push({
    timestamp: new Date(timestamp),
    date: timestamp.split(" ")[0],
    hour: parseInt(timestamp.split(" ")[1].split(":")[0]),
    minute: parseInt(timestamp.split(" ")[1].split(":")[1]),
    action
  })
});

parsedRecords.sort((a, b) => {
  return a.timestamp - b.timestamp;
});

let guards = new Map();
let id = null;
for (let record of parsedRecords) {  
  if (record.action.includes("begins shift")) {
    id = /#(\d+)/.exec(record.action)[1];

    if (!guards.has(id)){
      guards.set(id, {
        totalSleeping: 0,
        lastTime: record.timestamp,
        lastMinute: record.minute,
        sleepingMinutes: new Array(60).fill(0)
      });
    }
  } else if (record.action.includes("falls asleep")){
    const guard = guards.get(id);

    guard.lastTime = record.timestamp
    guard.lastMinute = record.minute
  } else if (record.action.includes("wakes up")){
    const guard = guards.get(id);

    const minutesPassed = (record.timestamp - guard.lastTime)/1000/60;
    guard.totalSleeping += minutesPassed;

    for (let i = guard.lastMinute; i < record.minute; i++){
      guard.sleepingMinutes[i]++;
    }

    guard.lastTime = record.timestamp;
  }
}

let guardSleptMostID = 0;
let maxSleepingTime = 0;
guards.forEach((guard, id) => {
  if (guard.totalSleeping > maxSleepingTime){
    maxSleepingTime = guard.totalSleeping;
    guardSleptMostID = id;
  }
});

let maxSleepingMinute = -1;
let maxValue = -1;
guards.get(guardSleptMostID.toString()).sleepingMinutes.forEach((value, idx) => {
  if (value > maxValue){
    maxSleepingMinute = idx;
    maxValue = value;
  }
});

console.log(maxSleepingMinute * guardSleptMostID)

let guardMostFrequentlySleepSameMinute = 0;
let minuteWithMostFrequency = -1;
maxValue = -1;
guards.forEach((guard, id) => {
  guard.sleepingMinutes.forEach((value, idx) => {
    if (value > maxValue){
      maxValue = value;
      minuteWithMostFrequency = idx;
      guardMostFrequentlySleepSameMinute = parseInt(id);
    }
  })
})
console.log(minuteWithMostFrequency, guardMostFrequentlySleepSameMinute, minuteWithMostFrequency * guardMostFrequentlySleepSameMinute);
