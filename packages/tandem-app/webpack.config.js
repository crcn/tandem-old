const {resolve} = require('path');
const {merge} = require('lodash');
const webpack   = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require("./webpack-base.config.js");

module.exports = merge({}, base, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].bundle.css'),
    new HtmlWebpackPlugin({
      title: "Aerial Playground",
      template: __dirname + '/src/index.html'
    }),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      ...base.module.rules,
      { test: /\.pc$/, use: [__dirname + '/../paperclip-react-transpiler/webpack-loader' ]},
      { test: /\.tsx?$/, use: ['react-hot-loader/webpack', 'ts-loader'] },
    ]
  }
});