var path              = require('path');
var webpack           = require('webpack');

function getModulePath(moduleName) {
  return __dirname + '/node_modules/' + moduleName ;
};

exports.create = function(options) {
  return {
    entry: options.entry,
    output: {
      path: __dirname + '/bundle',
      filename: '/[name].js',
      libraryTarget: 'var',
      library: options.output ? options.output.library : void 0,
      sourceMapFilename: '/bundle/[name].js.map'
    },
    resolve: {
      modulesDirectories: [__dirname + '/../', 'node_modules'],
      extensions: ['', '.json', '.jsx', '.js', '.es6']
    },
    sassLoader: {
      includePaths: [path.resolve(__dirname, './../')]
    },
    lazy: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500
    },
    node: {
      __filename: true
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    module: {
      loaders: [
        {
          test: /\.json$/,
          exclude: /(node_modules|bower_components)/,
          loader: getModulePath('json-loader')
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff)$/,
          loader: getModulePath('url-loader') + '?limit=1000'
        },
        {
          test: /\.peg$/,
          loader: getModulePath('pegjs-loader') + '?cache=true'
        },
        {
          test: /\.scss$/,
          loader: [
            getModulePath('style-loader'),
            getModulePath('css-loader'),
            getModulePath('sass-loader')
          ].join('!')
        },
        {
          test: /\.css$/,
          loader: [
            getModulePath('style-loader'),
            getModulePath('css-loader')
          ].join('!') 
        },
        {
          test: /\.(jsx|es6)?$/,
          exclude: /(node_modules|bower_components)/,
          loader: getModulePath('babel-loader'),
          query: {
            presets: ['react', 'es2015', 'stage-1', 'stage-0'],
            plugins: ['transform-decorators-legacy'],
            ignore: ['buffer']
          }
        }
      ]
    }
  };
}

module.exports = exports.create({});
module.exports.create = exports.create;