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
  for (const filePath in packages) {
    await cleanPackage(filePath, packages[filePath]);
  }
}

async function cleanPackage(filePath, package) {
  console.log(filePath);
  await exec(NPM_BIN, ["run", "clean"], {
    cwd: path.dirname(filePath)
  });
}
