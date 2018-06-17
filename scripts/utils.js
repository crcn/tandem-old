const fs = require("fs");
const { spawn } = require("child_process");
const { PACKAGES_DIRECTORY } = require("./constants");

function exec(bin, args, options) {
  console.log(`exec ${bin} ${args.join(" ")}`);
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, options);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.once("close", resolve);
    proc.once("error", reject);
  });
}

function logNotice(message) {
  console.log("----> %s" ,message);
}

function vtok(values) {
  const ret = {};
  for (const v of values) {
    ret[v] = 1;
  }
  return ret;
}

module.exports = {
  vtok,
  exec,
  logNotice
};