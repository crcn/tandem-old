const { readdirSync } = require("fs");
const { merge } = require("lodash"); 
const base = require("./base").config;
const { OUT_NODE_MODULES_DIR } = require("../config");

module.exports = base;