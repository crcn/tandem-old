const { Engine } = require("../..");
const e = new Engine();
// e.onChange(() => {
//   console.log("UP");
// });

let now = Date.now();
// for (let i = 100; i--;)
e.startRuntime(__dirname + "/main.pc");
console.log(Date.now() - now);

// console.log(JSON.stringify(e.drainEvents(), null, 2));
