var path          = require('path');
var baseDirectory = path.join(__dirname, '..'); 
var srcDirectory  = path.join(baseDirectory, 'src');

module.exports = {
    entry: {
      browser: path.join(srcDirectory, 'browser', 'entry.js')
    },
    output: {
        path: baseDirectory,
        filename: "[name].js"
    },
    resolve: {
      modulesDirectories: ['node_modules', 'src']
    },
    module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['es2015', 'stage-0']
            }
          },
          {
            test: /\.jsx?$/,
            loader: 'eslint',
            query: {
              
            }
          }
        ]
    }
};