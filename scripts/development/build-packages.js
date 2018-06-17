const path = require("path");
const { NPM_BIN } = require("../constants");
const { logNotice, exec } = require("../utils");

async function buildPackages({ packages, watch }) {

  let packageFilePair = [];

  for (const filePath in packages) {
    packageFilePair.push([filePath, packages[filePath]]);
  }

  // sort packages based on cross dependencies -- not doing
  // so may cause things to break
  packageFilePair = packageFilePair.sort(([,pa], [,pb]) => {
    if (hasDependency(pa, pb.name)) {
      return 1;
    } else if (hasDependency(pb, pa.name)) {
      return -1;
    }
    return -1;
  });

  // watch only works when all packages are built.
  if (watch) {
    await Promise.all(packageFilePair.map(([filePath, package]) => buildPackage(filePath, package, watch)));
  } else {

    // run sequentially. This needs to run
    for (const [filePath, package] of packageFilePair) {
      await buildPackage(filePath, package);
    }
  }
}

const hasDependency = (package, name) => Boolean((package.dependencies || {})[name] || (package.devDependencies || {})[name]);

async function buildPackage(filePath, package, watch) {
  if (!package.scripts.build) {
    logNotice(`Skipping ${package.name}`);
    return ;
  }
  logNotice(`Building ${package.name}...`);
  const args = ["run", "build"];
  await exec(NPM_BIN, watch ? [...args, "--", "--watch"] : args, {
    cwd: path.dirname(filePath)
  });
}

module.exports = buildPackages;