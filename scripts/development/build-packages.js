const path = require("path");
const { NPM_BIN } = require("../constants");
const { logNotice, exec } = require("../utils");

async function buildPackages({ packages, watch }) {

  const promises = [];

  for (const filePath in packages) {
    promises.push(buildPackage(filePath, packages[filePath], watch));
  }

  await Promise.all(promises);
}

async function buildPackage(filePath, package, watch) {
  if (!package.scripts.build) {
    logNotice(`Skipping ${package.name}`);
    return ;
  }
  logNotice(`Building ${package.name}...`);
  const args = ["run", "build"];
  exec(NPM_BIN, watch ? [...args, "--", "--watch"] : args, {
    cwd: path.dirname(filePath)
  });
}

module.exports = buildPackages;