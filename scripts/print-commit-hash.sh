#!/usr/bin/env node
const exec = require("child_process").exec;

exec("git show", (err, stdout, stderr) => {
	console.log(stdout.match(/commit\s([^\s]+)/)[1]);
}) 
