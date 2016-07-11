var path              = require('path');
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var deepExtend        = require('lodash/object/merge');

function createConfig(options) {

  return deepExtend(options, {
    output: {
      path: __dirname + '/public',
      filename: '/bundle/[name].js',
      publicPath: '/public/',
      sourceMapFilename: '/bundle/[name].js.map'
    },
    resolve: {
      modulesDirectories: [__dirname + '/src', 'node_modules', 'bower_components', 'src', 'vendor', __dirname],
      extensions: ['', '.json', '.jsx', '.js']
    },
    sassLoader: {
      includePaths: [path.resolve(__dirname, './src')]
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
          test: /\.peg$/,
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
            plugins: ['transform-decorators-legacy'],
            ignore: ['buffer']
          }
        }
      ]
    }
  })
}
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
.filter(function(x) {
  return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = [
  createConfig({
    entry: {
      'browser' : './src/browser/entry.js'
    }
  }),
  createConfig({
    entry: {
      'server' : './src/server/entry.js'
    },
    target: 'node',
    output: {
      libraryTarget: 'commonjs2'
    },
    externals: nodeModules
  })
]
