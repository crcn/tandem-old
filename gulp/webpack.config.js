const webpack               = require("webpack");
const path                  = require("path");
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');

const { BASE_DIR, SRC_DIR } = require('./config');

module.exports = {
    resolve: {
      alias: {
        'react': 'node_modules/react/dist/react.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js'
      }
    },
    sassLoader: {
      includePaths: [SRC_DIR]
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
      }),
      new ExtractTextPlugin("styles.css")
    ],
    node: {
      __filename: true,
      fs: "empty",
      Buffer: true
    },
    module: {
      loaders: [
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
          loader: "url-loader?limit=1000"
        },
        {
          test: /\.json$/,
          loader: "json-loader"
        },
        {
          test: /\.peg$/,
          loader: "pegjs-loader"
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: __dirname + "/out/node_modules"
        },
        // {
        //   test: /\.tsx?$/,
        //   loader: "tslint-loader"
        // },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", [
            "css-loader",
            "sass-loader"
          ].join("!"))
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", [
            "css-loader"
          ].join("!"))
        },
      ]
    }
  }