var gulp  = require('gulp');
var mocha = require('gulp-mocha');
var karma = require('karma');

var args = require('yargs').argv;


var mochaOptions = {
  timeout: 1000
};

var paths = {
  testFiles: ['packages/**/*-test.js'],
  allFiles: ['packages/**/*.js']
};

gulp.task('test', function(complete) {
  new karma.Server({
    configFile: __dirname + '/karma.config.js',
    singleRun: !args.watch,
    reporters: [args.reporter || 'spec'],
    client: {
      mocha: {
        grep: args.only || args.grep
      }
    }
  }, complete).start();
});

gulp.doneCallback = function() {
  if (!args.watch) process.exit();
}
