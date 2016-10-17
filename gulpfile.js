const gulp     = require('gulp');
const symdest  = require('gulp-symdest');
const electron = require('gulp-atom-electron');
const pkg      = require('./package.json');
const fsa      = require('fs-extra');
const exec     = require('child_process').exec;
const gulpSequence = require('gulp-sequence');

gulp.task('clean', ['clean-desktop']);
gulp.task('build', gulpSequence('copy-assets', 'build-desktop'));

gulp.task('clean-desktop', _rimraf("./app"));

gulp.task('build-desktop', function() {
  const platform = process.platform;

  return gulp.src('package.json')
    .pipe(electron({ version: pkg.electronVersion, platform: platform }))
    .pipe(symdest('app'));
});

gulp.task('copy-assets', _exec("scripts/copy-src-assets.sh"));

function _rimraf(directory) {
  return function() {
    fsa.removeSync(directory);
  }
}

function _exec(script) {
  return function(complete) {
    exec(script, complete);
  }
}