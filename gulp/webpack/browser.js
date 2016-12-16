const { readdirSync } = require("fs");
const { merge } = require("lodash"); 
const base = require("./base").config;
const { OUT_NODE_MODULES_DIR } = require("../config");

module.exports = merge({}, base, {
  resolve: {
    alias: {
      "request": "null-loader?"
    }
  },
  externals: {
    'electron': 'require("electron")'
  },
  node: {
    fs: "empty"
  }
});