const fs = require("fs");
const a = 100;

fs.readFile("./file.txt", "utf-8", () => {
  console.log("File Reading CB");
});
setImmediate(() => console.log("setImmediate"));

Promise.resolve("Promise").then(console.log);

setTimeout(() => console.log("Timer expired"), 0);

process.nextTick(() => console.log("process.nextTick"));

function printA() {
  console.log("A=", a);
}

printA();
console.log("Last line of the file");

///OUTPUT

// A=100
// Last line of the file
// process.nextTick
// Promise
// Timer expired
// setImmediate
// File Reading CB
