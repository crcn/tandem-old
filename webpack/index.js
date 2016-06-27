var path          = require('path');
var baseDirectory = path.join(__dirname, '..');
var srcDirectory  = path.join(baseDirectory, 'src');

module.exports = {
  entry: {
    browser: path.join(srcDirectory, 'browser-app', 'entry.ts')
  },
  output: {
    path: path.join(baseDirectory, 'public', 'build'),
    publicPath: '/public/build/',
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.peg', '.ts', '.tsx'],
    modulesDirectories: ['node_modules', 'src']
  },
  node: {
    __filename: true
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(jsx?|tsx?)$/,
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
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
};