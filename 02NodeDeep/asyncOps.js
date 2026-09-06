const https = require("https");
const fs = require("fs");
const crypto = require("node:crypto");

var a = 104343;
var b = 20223;

// sync function will block the main thread dont use that

crypto.pbkdf2Sync("password", "salt", 5000000, 50, "sha512");
console.log("first key genrated");

//async
crypto.pbkdf2("password", "salt", 50000, 50, "sha512", (err, key) => {
  console.log("second Key is generated");
});

//synchronous
const data = fs.readFileSync("./file.txt", "utf8");

console.log("FileData", data);
console.log("Block`");

https.get("https://jsonplaceholder.typicode.com/todos/1", (res) => {
  console.log("data fetched successfully");
});

setTimeout(() => {
  console.log("hello");
}, 4000);

// async
fs.readFile("./file.txt", "utf8", (err, data) => console.log("FileData", data));

function multiply(x, y) {
  const result = a * b;
  return result;
}

var c = multiply(a, b);

console.log(c);
