const fs = require("fs");
const {transpileToReactComponents, transpileToTypeScriptDefinition } = require("..");
const arg = process.argv[2];

// paperclip-react-transpiler [path] > out
console.log(transpileToReactComponents(fs.readFileSync(arg, "utf8")));
