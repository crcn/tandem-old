const fs = require("fs");
const pc = require("..");

const arg = process.argv[2];

pc.transpileToVanilla(arg, {
  io: {
    readFile(uri) {
      return Promise.resolve(fs.readFileSync(uri, "utf8"));
    }
  }
}).then(({code}) => {
  console.log(code);
});
