const fsa = require("fs-extra");
const path = require("path");
const { PACKAGES, NPM_BIN } = require("../constants");
const { logNotice, exec, vtok } = require("../utils");

clean({
  packages: PACKAGES
});

async function clean(context) {
  await cleanPackages(context.packages);
}

async function cleanPackages(packages) {
  const promises = [];
  for (const filePath in packages) {
    promises.push(cleanPackage(filePath, packages[filePath]));
  }
  await Promise.all(promises);
}

async function cleanPackage(filePath, package) {
  console.log(filePath);
  await exec(NPM_BIN, ["run", "clean"], {
    cwd: path.dirname(filePath)
  });
}
