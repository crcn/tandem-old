#!/usr/bin/env node
var glob = require('glob');
var fs   = require('fs');
var fsa  = require('fs-extra');
var path = require('path');
var chalk = require('chalk');

const rootDir    = path.normalize(__dirname + '/..');
const assetPaths = glob.sync(rootDir + '/src/**');

assetPaths.forEach(function(assetPath) {
	if (/(ts|tsx|log)$/.test(assetPath) && process.argv.indexOf('--include-ts') === -1) return;
	if (fs.lstatSync(assetPath).isDirectory()) return;

	var relPath     = assetPath.substr(rootDir.length + 1);
	var copyRelPath =  path.join('lib',  relPath.substr(3));

	console.log(chalk.bold('cp'), chalk.grey(relPath), chalk.grey('>'), chalk.cyan(copyRelPath));

	fsa.copySync(assetPath, path.join(rootDir, copyRelPath));
});