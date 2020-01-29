const { Engine } = require("../..");
const fs = require("fs");
const e = new Engine({
  httpPath: "http://oka"
});
e.onEvent(event => {
  console.log(event);
});

let now = Date.now();
// for (let i = 100; i--;)
e.startRuntime(__dirname + "/main.pc");
console.log(Date.now() - now);

// console.log(JSON.stringify(e.drainEvents(), null, 2));
