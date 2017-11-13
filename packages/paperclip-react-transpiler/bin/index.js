const fs = require("fs");
const { transpile } = require("..");
const arg = process.argv[2];

// paperclip-react-transpiler [path] > out
console.log(transpile(fs.readFileSync(arg, "utf8")));
