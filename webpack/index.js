var path = require('path');
var baseDirectory = path.join(__dirname, '..');
var srcDirectory = path.join(baseDirectory, 'src');

module.exports = {
  entry: {
    browser: path.join(srcDirectory, 'browser', 'entry.ts')
  },
  output: {
    path: path.join(baseDirectory, 'public', 'build'),
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.peg', '.ts'],
    modulesDirectories: ['node_modules', 'src']
  },
  node: {
    __filename: true
  },
  module: {
    loaders: [
      {
        test: /\.(jsx?|ts)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'traceur',
        query: {
          experimental: true,
          runtime: true
        }
      },
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        query: {

        }
      },
      {
        test: /\.peg$/,
        loader: 'pegjs-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
};