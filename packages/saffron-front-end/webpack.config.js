var path              = require('path');
var webpack           = require('webpack');

module.exports = require('saffron-common/webpack.config').create({
  entry: {
    'saffron-front-end' : './entry.es6'
  },
  output: {
    library: ['Saffron', 'app']
  }
});