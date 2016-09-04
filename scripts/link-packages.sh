#!/usr/bin/env node

var fs = require('fs');
var exec = require('./utils/exec');
var eachAsync = require('./utils/each-async');
var log = require('./utils/log');
var path  = require('path');

var tandemPackageFiles = require('./utils/package-paths');

var packageNames = tandemPackageFiles.map(function(packagePath) {
  return require(packagePath).name;
});

(!~process.argv.indexOf('--skip-install') ? eachAsync(tandemPackageFiles, npmLink) : Promise.resolve())
.then(eachAsync.bind(this, tandemPackageFiles, linkEachLocalDependency.bind(this, packageNames))).
then(log.done);

function npmLink(packagePath, deps) {
  deps = Array.isArray(deps) ? deps : deps == void 0 ? [] : [deps];
  log.packageCommand('npm link %s %s', packagePath, deps.join(' '))
  return exec('npm', ['link'].concat(deps), {
    cwd: path.dirname(packagePath)
  });
}

function linkEachLocalDependency(packageNames, modulePath) {

  var package = require(modulePath);
  var packagesNamesToLink = packageNames.filter(function(packageName) {
    return !!package.dependencies[packageName];
  });

  return eachAsync(packagesNamesToLink, npmLink.bind(this, modulePath));
}