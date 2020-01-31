const { Engine } = require("../..");
const fs = require("fs");
const e = new Engine({});
e.onEvent(event => {
  console.log(event);
});

let now = Date.now();
// for (let i = 100; i--;)
e.load(__dirname + "/main.pc");
console.log(Date.now() - now);

// console.log(JSON.stringify(e.drainEvents(), null, 2));
