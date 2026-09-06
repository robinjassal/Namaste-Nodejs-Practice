function x() {
  const a = 10;
  function b() {
    console.log("b");
  }
}

console.log(a);

//All the code od the module is wraed inside the function IIFE

// (function (modules,require){

// all code of module come inside

// })()
