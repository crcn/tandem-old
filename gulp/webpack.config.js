const webpack               = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const { join }              = require('path');

const {
  WATCH,
  SRC_DIR,
  OUT_DIR,
  BASE_DIR,
  NODE_MODULES_DIR
} = require('./config');

// SANDBOXED=1 tandem component.tsx
const SANDBOXED = !!process.env.SANDBOXED;

module.exports = {
    output: {
      filename: '[name].js',
    },
    sassLoader: {
      includePaths: [SRC_DIR]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.peg'],
      modulesDirectories: [SRC_DIR, NODE_MODULES_DIR],
      alias: {
        'react': 'node_modules/react/dist/react.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js'
      }
    },
    ts: {
      transpileOnly: true
    },
    watch: !!WATCH,
    plugins: [
      new webpack.DefinePlugin({

        // required for mongoid-js plugin particularly
        'process.pid': process.pid
      }),
      new WebpackNotifierPlugin({
        alwaysNotify: true
      }),
      new ExtractTextPlugin('styles.css')
    ],
    node: {
      __filename: true,
      fs: 'empty',
      Buffer: true
    },
    module: {
      loaders: [
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
          loader: 'url-loader?limit=1000'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.peg$/,
          loader: 'pegjs-loader'
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude:  /node_modules/
        },
        {
          test: /\.scss$/,
          loader: [
            'style-loader',
            'css-loader?sourceMap',
            'sass-loader?sourceMap'
          ].join('!')
        },
        {
          test: /\.css$/,
          loader: [
            'style-loader',
            'css-loader?sourceMap'
          ].join('!')
        },
      ]
    }
  }