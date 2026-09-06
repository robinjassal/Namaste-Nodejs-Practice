const fs = require("fs");

setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("Timer expired"), 0);

Promise.resolve("Promise").then(console.log);

fs.readFile("./file.txt", "utf-8", () => {
  setTimeout(() => console.log("2nd Timer expired"), 0);

  process.nextTick(() => console.log("2nd tick"));
  setImmediate(() => console.log("2nd setImmediate"));
  console.log("File Reading CB");
});

process.nextTick(() => console.log("nextTick"));

console.log("Last line of the file");

///OUTPUT

// Last line of the file
// nextTick
// Promise
// Timer expired
// setImmediate
// File Reading CB
// 2nd tick
// 2nd Timer expired
// 2nd setImmediate
