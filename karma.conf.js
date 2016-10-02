// Karma configuration
// Generated on Tue Jun 14 2016 10:30:52 GMT-0400 (EDT)

var watchFiles = !process.env.WATCH;
var reporter   = process.env.REPORTER || "dots";
var grep       = process.env.GREP;
var bail       = !!process.env.BAIL;
var timeout    = Number(process.env.TIMEOUT || 5000);

const webpackConfig = require("./webpack.config");

delete webpackConfig["entry"];

module.exports = function(config) {
  config.set({

    customLaunchers: {
        Chrome_travis_ci: {
            base: "Chrome",
            flags: ["--no-sandbox"]
        }
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "chai"],

     // list of files / patterns to load in the browser
    files: [
      "node_modules/ts-helpers/index.js",
      "node_modules/react/dist/react.min.js",
      "node_modules/react-dom/dist/react-dom.min.js",
      {
        pattern: "all-tests.js",
        included: true
      }
    ],

    plugins: [
        require("karma-chrome-launcher"),
        require("karma-spec-reporter"),
	require("karma-safari-launcher"),
        require("karma-mocha"),
        require("karma-webpack"),
        require("karma-chai")
    ],

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
        timeout: timeout,
        grep: grep,
        bail: bail,
        ui: "bdd"
      }
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "all-tests.js": ["webpack"]
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      reporter
    ],

    webpack: webpackConfig,

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
    browsers: ["Chrome"],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: watchFiles,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    browserNoActivityTimeout: 0
  })
}
