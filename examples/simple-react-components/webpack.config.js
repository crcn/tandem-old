const HtmlPlugin = require('html-webpack-plugin');
const SRC_DIR = __dirname + '/src';
const webpack = require('webpack');

module.exports = {
  entry:  './src/preview.tsx',
  output: {
    path: 'out',
    filename: 'preview.bundle.js',
    publicPath: "file://" + __dirname + "/out/"
  },
  plugins: [
    new HtmlPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx', '.css', '.scss'],
    moduleDirectories: [SRC_DIR, __dirname + '/node_modules'],
  },
  sassLoader: {
    includePaths: [SRC_DIR],
    outputStyle: 'expanded',

  },
  module: {
    loaders: [
      {
        test:/\.(eot|woff|png|svg|ttf)$/,
        loader: 'url-loader?limit=1000',
      },
      {
        test: /\.tsx?/,
        loader: 'webpack-tandem-jsx-loader!ts-loader?sourceMap',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: `style-loader?sourceMap!css-loader?sourceMap`
      },
      {
        test: /\.scss$/,
        loader: `style-loader?sourceMap!css-loader?sourceMap&sourceRoot=${encodeURIComponent('file://' + __dirname)}!sass-loader?sourceMap=true`
      }
    ]
  }
}