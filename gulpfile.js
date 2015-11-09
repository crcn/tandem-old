var gulp  = require('gulp');
var mocha = require('gulp-mocha');

require('babel-core/register')({
  presets: ['react', 'es2015']
});

var mochaOptions = {
  timeout: 1000
};

var paths = {
  testFiles: ['packages/**/*-test.js'],
  allFiles: ['packages/**/*.js']
};

gulp.task('test', function() {
  return gulp.src(paths.testFiles)
  .pipe(mocha(mochaOptions));
});


gulp.task('watch', function() {
  var tasks = Array.prototype.slice.call(process.argv, 2).concat();
  tasks.pop();
  gulp.watch(paths.allFiles, tasks);
});
