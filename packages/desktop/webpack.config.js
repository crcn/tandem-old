const {resolve} = require('path');
const {merge} = require('lodash');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require("./webpack-base.config.js");

module.exports = merge({}, base, {
  plugins: [
    new HtmlWebpackPlugin({
      title: "Tandem Desktop",
      template: __dirname + '/src/front-end/index.html'
    }),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      ...base.module.rules,
      { test: /\.tsx?$/, use: ['ts-loader'] }
    ]
  }
});