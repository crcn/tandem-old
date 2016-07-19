
var watchFiles = !process.env.WATCH;
var reporter   = process.env.REPORTER || 'dots';
var grep       = process.env.GREP;

var fs         = require('fs');
var path       = require('path');

function create(options) {
  return function(config) {

    var cwd = process.cwd();

    var moduleDirs = fs.readdirSync(cwd).filter(function(basename) {
      return !/(^\.)|node_modules/.test(basename) && fs.lstatSync(path.join(cwd, basename)).isDirectory();
    });

    var testFilesGlob = `{${moduleDirs.join(',')}}/**/*-test.ts`;


    config.set({

      customLaunchers: {
          Chrome_travis_ci: {
              base: 'Chrome',
              flags: ['--no-sandbox']
          }
      },

      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',


      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['mocha', 'chai'],


      // list of files / patterns to load in the browser
      files: [
        testFilesGlob
      ],

      plugins: [
          require('karma-chrome-launcher'),
          require('karma-mocha'),
          require('karma-webpack'),
          require('karma-chai')
      ],

      webpack: require('./webpack.config'),

      webpackMiddleware: {
          // webpack-dev-middleware configuration
          // i. e.
          noInfo: true
      },

      // list of files to exclude
      exclude: [
      ],

      client: {
        mocha: {
          grep: grep,
          ui: 'bdd'
        }
      },

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        '**/*-test.ts': ['webpack']
      },


      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: [
        reporter
      ],


      // web server port
      port: 9876,


      // enable / disable colors in the output (reporters and logs)
      colors: true,


      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,


      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,


      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['Chrome_travis_ci'],


      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: watchFiles,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity
    })
  }
}

module.exports = create({});
module.exports.create = create;