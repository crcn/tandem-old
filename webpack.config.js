var path              = require('path');
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var deepExtend        = require('lodash/object/merge');

function createConfig(options) {

  return deepExtend(options, {
    output: {
      path: __dirname + '/public/bundle',
      filename: '/[name].js',
      publicPath: '/bundle/',
      sourceMapFilename: '/bundle/[name].js.map'
    },
    stats: {
      hash: true,
      version: true,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: true,
      children: false,
      source: false,
      errors: true,
      errorDetails: false,
      warnings: false,
      publicPath: false
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
      new ExtractTextPlugin('/bundle/[name].css'),
      new webpack.DefinePlugin({
        'process.env.TESTING': process.env.TESTING != void 0
      })
    ],
    eslint: {
      fix: true
    },
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
          exclude: /(node_modules\/(?!mesh).+)|bower_components/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015', 'stage-1', 'stage-0'],
            plugins: ['transform-decorators-legacy'],
            ignore: ['^buffer$']
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'eslint'
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
      'front-end' : './src/front-end/entry.js'
    }
  }),
  createConfig({
    entry: {
      'back-end' : './src/back-end/entry.js'
    },
    target: 'node',
    output: {
      libraryTarget: 'commonjs2'
    },
    externals: nodeModules
  }),createConfig({
    entry: {
      'back-end-lib' : './src/back-end/application.js'
    },
    target: 'node',
    output: {
      libraryTarget: 'commonjs2'
    },
    externals: nodeModules
  })
]
