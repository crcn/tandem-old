var path              = require('path');
var webpack           = require('webpack');

module.exports = require('saffron-common/webpack.config').create({
  entry: {
    'saffron-html-bundle' : './index.es6'
  },
  output: {
    library: ['Saffron', 'htmlBundle']
  }
});