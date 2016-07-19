var path = require('path');

module.exports = function(options) {
  var cwd = process.cwd();

  return {
    entry: {
      [options.name]: path.join(cwd, options.main)
    },
    output: {
      path: path.join(cwd, options.saffron.directory),
      libraryTarget: 'var',
      library: ['Saffron', options.name],
      filename: "[name].js"
    },
    sassLoader: {
      includePaths: [path.resolve(cwd, './../')]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.peg', '.ts', '.tsx'],
      modulesDirectories: ['node_modules', 'src', cwd + '/../']
    },
    watch: process.env.WATCH === '1',
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
          test: /\.scss$/,
          loader: [
            getModulePath('style-loader'),
            getModulePath('css-loader'),
            getModulePath('sass-loader')
          ].join('!')
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff)$/,
          loader: getModulePath('url-loader') + '?limit=1000'
        },
        {
          test: /\.css$/,
          loader: [
            getModulePath('style-loader'),
            getModulePath('css-loader')
          ].join('!')
        },
        {
          test: /\.peg$/,
          loader: getModulePath('pegjs-loader')
        },
        {
          test: /\.tsx?$/,
          loader: getModulePath('ts-loader')
        }
      ]
    }
  };
}

function getModulePath(moduleName) {
  return path.join(__dirname + '/node_modules/' + moduleName);
}