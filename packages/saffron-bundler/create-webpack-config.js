var path = require('path');

module.exports = function(options) {
  var cwd = process.cwd();

  return {
    entry: {
      [options.name]: path.join(cwd, options.main)
    },
    output: {
      path: path.join(cwd, options.directory),
      libraryTarget: 'var',
      library: ['Saffron', options.name],
      filename: "[name].js"
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.peg', '.ts', '.tsx'],
      modulesDirectories: ['node_modules', 'src']
    },
    watch: true,
    node: {
      __filename: true
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
  return path.join(__dirname + '/' + moduleName);
}