var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    'app' : './src/editor/entry.js'
  },
  output: {
    path: __dirname + '/public/bundle',
    filename: '/[name].js',
    sourceMapFilename: '/[name].js.map'
  },
  resolve: {
    modulesDirectories: [__dirname + '/src', 'node_modules', 'bower_components', 'src', 'vendor'],
    extensions: ['', '.json', '.jsx', '.js']
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './src')]
  },
  publicPath: 'static/',
  lazy: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 500
  },
  node: {
    __filename: true
  },
  plugins: [
    new ExtractTextPlugin('/[name].css')
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
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015', 'stage-1', 'stage-0'],
          plugins: ['transform-decorators'],
          ignore: ['buffer']
        }
      }
    ]
  }
};
