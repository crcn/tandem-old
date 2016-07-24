#!/usr/bin/env node
var glob = require('glob');
var fs   = require('fs');

var allTestFiles = glob.sync(__dirname + '/../src/**/*-test.?(ts|tsx)');

var buffer = [`
/*
This is an auto-generated file which includes all test files into one. Including all tests into one
greatly speeds up the transpiler for KarmaJS (CC)
*/

`];

buffer.push(...allTestFiles.map(function(filePath) {
  return `require('${filePath}');\n`;
}));

fs.writeFile(__dirname + '/../all-tests.js', buffer.join(''));