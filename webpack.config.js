var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    'browser' : './packages/browser/entry.js'
  },
  output: {
    path: __dirname + '/public',
    filename: '/bundle/[name].js',
    publicPath: '/public/',
    sourceMapFilename: '/bundle/[name].js.map'
  },
  resolve: {
    modulesDirectories: [__dirname + '/packages', 'node_modules', 'bower_components', 'packages', 'vendor', __dirname],
    extensions: ['', '.json', '.jsx', '.js']
  },
  devtool: 'eval',
  sassLoader: {
    includePaths: [path.resolve(__dirname, './packages')]
  },
  lazy: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 500
  },
  node: {
    __filename: true
  },
  plugins: [
    new ExtractTextPlugin('/bundle/[name].css')
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff)$/,
        loader: 'url-loader?limit=1000'
      },
      {
        test: /\.pegjs$/,
        loader: 'pegjs-loader?cache=true'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1', 'stage-0'],
          plugins: ['transform-decorators'],
          ignore: ['buffer']
        }
      }
    ]
  }
};
