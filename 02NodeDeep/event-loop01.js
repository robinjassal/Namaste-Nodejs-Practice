const fs = require("fs");
const a = 100;

setImmediate(() => console.log("setImmediate"));

fs.readFile("./file.txt", "utf-8", () => {
  console.log("File Reading CB");
});

setTimeout(() => console.log("Timer expired"), 0);

function printA() {
  console.log("A=", a);
}

printA();
console.log("Last line of the file");

///OUTPUT

// A=100
// Last line of the file
// Timer expired
// setImmediate
// File Reading CB
