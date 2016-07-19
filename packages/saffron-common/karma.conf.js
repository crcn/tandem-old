var path          = require('path');
var baseDirectory = path.join(__dirname, '..');
var srcDirectory  = path.join(baseDirectory, 'src');

function create(options) {
  return {
    entry: options.entry,
    output: {
      path: '/bundle',
      libraryTarget: 'var',
      library: options.output ? options.output.library : void 0
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
}

module.exports = create({});
module.exports.create = create;