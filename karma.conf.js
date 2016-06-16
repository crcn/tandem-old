// Karma configuration
// Generated on Tue Jun 14 2016 10:30:52 GMT-0400 (EDT)

var watchFiles = !process.env.WATCH;
var reporter   = process.env.REPORTER || 'dots';
var grep       = process.env.GREP;

module.exports = function(config) {
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
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'all-tests.js'
    ],

    plugins: [
        require('karma-chrome-launcher'),
        require('karma-mocha'),
        require('karma-webpack')
    ],

    webpack: require('./webpack'),

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
      'all-tests.js': ['webpack']
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
