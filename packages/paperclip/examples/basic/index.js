const jayson = require("jayson");

// create a client
const client = jayson.client.tcp({
  path: "/tmp/json-ipc-test.ipc"
});

for (let i = 1000; i--; )
  client.request("say_hello", [], function(err, response) {
    if (err) throw err;
    console.log(response.result); // 2
  });

// const { Engine } = require("../..");
// const fs = require("fs");
// const e = new Engine({
//   httpPath: "http://oka"
// });
// e.onEvent(event => {
//   console.log(event);
// });

// let now = Date.now();
// // for (let i = 100; i--;)
// e.startRuntime(__dirname + "/main.pc");
// console.log(Date.now() - now);

// // console.log(JSON.stringify(e.drainEvents(), null, 2));
