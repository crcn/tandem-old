const path = require("path");
const { PM_BIN } = require("../constants");
const { logNotice, exec } = require("../utils");

async function installPackages({ packages }) {
  logNotice("Installing packages...");
  for (const filePath in packages) {
    await installPackage(filePath, packages[filePath]);
  }
}

async function installPackage(filePath, package) {
  const directory = path.dirname(filePath);
  logNotice(`Installing ${package.name}...`);
  await exec(PM_BIN, ["install"], { cwd: directory });
  await exec(PM_BIN, ["unlink"], { cwd: directory });
  await exec(PM_BIN, ["link"], { cwd: directory });
}

module.exports = installPackages;