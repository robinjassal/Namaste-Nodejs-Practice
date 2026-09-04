import { CalcSub } from "./newModeuleEJS.js";
import { multiply } from "./calculate/index.js";
// require("./xyz.js");
// const calculateSum = require("./sum.js");

// const obj = require("./sum.js");
var name = "Namaste Nodejs";
// z = 10; its bydefault strict mode so it will give error
var a = 10;
var b = 20;
// calculateSum(a, b);
// obj.calculateSum(a, b);
CalcSub(a, b);
multiply(a, b);
// console.log(obj.x);
console.log(name);
console.log(a + b);
// console.log(globalThis);
