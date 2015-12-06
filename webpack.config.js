var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    'app' : './packages/app-main/entry.js'
  },
  output: {
    path: __dirname + '/public',
    filename: '/js/[name].bundle.js',
    sourceMapFilename: '/js/[name].bundle.js.map'
  },
  resolve: {
    modulesDirectories: [__dirname + '/src', 'node_modules', 'bower_components', 'packages', 'vendor'],
    extensions: ['', '.json', '.jsx', '.js']
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./packages")]
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
    new ExtractTextPlugin('/css/[name].bundle.css')
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=1000&prefix=web/static'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style', 'raw!sass')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'raw')
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
