const fs = require("fs");
const path = require("path");

const NPM_BIN = "npm";
const YARN_BIN = "yarn";
const LERNA_BIN = path.resolve(__dirname + "/../node_modules/.bin/lerna");
const PM_BIN = process.env.USE_NPM ? NPM_BIN : YARN_BIN;
const PACKAGES_DIRECTORY = __dirname + "/../packages";
const PACKAGE_FILE_PATHS = fs.readdirSync(PACKAGES_DIRECTORY).map((basename) => path.join(PACKAGES_DIRECTORY, basename, "package.json")).filter(filePath => fs.existsSync(filePath, "utf8"));
const PACKAGES = PACKAGE_FILE_PATHS.reduce((packages, filePath) => Object.assign({
  [filePath]: require(filePath)
}, packages), {});

module.exports = {
  NPM_BIN,
  YARN_BIN,
  LERNA_BIN,
  PM_BIN,
  PACKAGES_DIRECTORY,
  PACKAGE_FILE_PATHS,
  PACKAGES
};