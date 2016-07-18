var path              = require('path');
var webpack           = require('webpack');

module.exports = {
  entry: {
    'saffron-editor-bundle' : './index.es6'
  },
  output: {
    path: __dirname + '/bundle',
    filename: '/[name].js',
    libraryTarget: 'var',
    library: ['Saffron', 'editorBundle'],
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
        test: /\.(jsx|es6)?$/,
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
};