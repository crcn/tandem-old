const fs = require("fs");
const path = require("path");
const { PM_BIN } = require("../constants");
const { logNotice, exec } = require("../utils");

async function linkPackages({ packages }) {
  for (const filePath in packages) {
    await linkPackage(filePath, packages[filePath], packages);
  }
}

async function linkPackage(filePath, package, packages) {
  logNotice(`Cross linking ${package.name}...`);
  const localDependencyNames = Object.keys(Object.assign({}, package.dependencies, package.devDependencies)).filter(name => {
    return Object.values(packages).some(package => {
      return package.name === name;
    });
  });

  const promises = [];

  for (const depName of localDependencyNames) {
    promises.push(exec(PM_BIN, ["link", depName], {
      cwd: path.dirname(filePath)
    }));
  }

  await Promise.all(promises);
}

module.exports = linkPackages;