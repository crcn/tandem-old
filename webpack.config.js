var webpack               = require("webpack");
var path                  = require("path");
var ExtractTextPlugin     = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports =  {
  entry: {
    "@tandem/front-end": __dirname + "/src/@tandem/front-end/entry.ts"
  },
  output: {
    path: "lib/@tandem/front-end/bundle",
    filename: "[name].js"
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, __dirname + "/src")]
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx", ".peg"],
    modulesDirectories: ["src", "node_modules"]
  },
  watch: process.env.WATCH === "1",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.TESTING": process.env.TESTING === "1",

      // required for mongoid-js plugin particularly
      "process.pid": process.pid
    }),
    new WebpackNotifierPlugin({
      alwaysNotify: true
    })
  ],
  node: {
    __filename: true,
    fs: "empty"
  },

  // more options in the optional tslint object
  tslint: {
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: [
          getModuleDirectory("style-loader"),
          getModuleDirectory("css-loader"),
          getModuleDirectory("sass-loader")
        ].join("!")
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|svg)$/,
        loader: getModuleDirectory("url-loader") + "?limit=1000"
      },
      {
        test: /\.json$/,
        loader: getModuleDirectory("json-loader")
      },
      {
        test: /\.css$/,
        loader: [
          getModuleDirectory("style-loader"),
          getModuleDirectory("css-loader")
        ].join("!")
      },
      {
        test: /\.peg$/,
        loader: getModuleDirectory("pegjs-loader")
      },
      {
        test: /\.tsx?$/,
        loader: getModuleDirectory("ts-loader")
      },
      {
        test: /\.tsx?$/,
        loader: getModuleDirectory("tslint-loader")
      }
    ]
  }
};

function getModuleDirectory(moduleName) {
  return path.join(__dirname, "node_modules", moduleName);
}
