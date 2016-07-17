#!/usr/bin/env node

var fs = require('fs');
var _exec = require('./utils/exec');
var _eachAsync = require('./utils/each-async');
var path  = require('path');

var packagesDir = __dirname + '/../packages';

var saffronPackageFiles = fs.readdirSync(__dirname + '/../packages').map(function(fileName) {
  return !/^\./.test(fileName) ? path.join(packagesDir, fileName, 'package.json') : void 0;
}).filter(function(filePath) {
  return !!filePath;
});

var packageNames = saffronPackageFiles.map(function(packagePath) {
  return require(packagePath).name;
});

(!~process.argv.indexOf('--skip-link') ? _eachAsync(saffronPackageFiles, npmLink) : Promise.resolve()) 
.then(_eachAsync.bind(this, saffronPackageFiles, linkEachLocalDependency.bind(this, packageNames)));

function npmLink(packagePath, deps) {
  deps = Array.isArray(deps) ? deps : deps == void 0 ? [] : [deps];
  console.log('\x1b[1mnpm link %s\x1b[22m', [packagePath].concat(deps).join(' '));
  return _exec('npm', ['link'].concat(deps), {
    cwd: path.dirname(packagePath)
  });
}

function linkEachLocalDependency(packageNames, modulePath) {

  var package = require(modulePath);
  var packagesNamesToLink = packageNames.filter(function(packageName) {
    return !!package.dependencies[packageName];
  });

  return _eachAsync(packagesNamesToLink, npmLink.bind(this, modulePath));
}