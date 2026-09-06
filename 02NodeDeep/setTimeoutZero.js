console.log("hello world");

var a = 20;
var b = 22;

setTimeout(() => {
  console.log("call me after 0");
}, 0);
setTimeout(() => {
  console.log("call me after 3000");
}, 3000);

console.log(a + b);
