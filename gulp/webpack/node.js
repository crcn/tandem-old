const { readdirSync } = require("fs");
const { merge } = require("lodash"); 
const base = require("./base");
const webpack = require("webpack");
const { OUT_NODE_MODULES_DIR } = require("../config");

exports.create = (dirname) => {
  const externals = {};

  readdirSync(dirname).forEach((dir) => {

    // module may not actually exist
    try {
      // console.log(dirname + "/" + dir);
      require.resolve(dirname + "/" + dir);
      externals[dir] = "commonjs " + dir;
    } catch(e) {
      
    }
  });

  externals.__root = "__dirname";

  return merge({}, base.config, {
    target: "electron",
    externals: externals,
    plugins: base.plugins.concat([
      new webpack.ProvidePlugin({
        "__root": "__root"
      })
    ])
  });
}