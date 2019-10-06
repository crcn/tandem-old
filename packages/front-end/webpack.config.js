const {resolve} = require('path');
const {merge} = require('lodash');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const base = require("./webpack-base.config.js");


module.exports = merge({}, base, {
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "test.html",
      title: "Tandem Playground",
      chunks: ["test"],
      template: __dirname + '/src/index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ["index"],
      filename: "index.html",
      title: "Tandem Playground",
      template: __dirname + '/src/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new WebpackNotifierPlugin()
  ]
});
