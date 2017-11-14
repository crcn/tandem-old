const fs = require("fs");
const pc = require("..");
const path = require("path");

const arg = process.argv[2];

pc.bundleVanilla(arg, {
  io: {
    readFile(uri) {
      return Promise.resolve(fs.readFileSync(uri, "utf8"));
    },
    resolveFile(uri, base) {
      return Promise.resolve(path.resolve(path.dirname(base), uri));
    }
  }
}).then(({code}) => {
  console.log(code);
});
