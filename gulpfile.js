/*
1. copy script assets
2. install dependencies
*/

const gulp     = require('gulp');
const path     = require('path');
const symdest  = require('gulp-symdest');
const electron = require('gulp-atom-electron');
const pkg      = require('./package.json');
const fsa      = require('fs-extra');
const exec     = require('child_process').exec;
const gulpSequence = require('gulp-sequence');

/**
 * Gulp configuration
 */

const BASE_DIRECTORY = __dirname;
const SRC_DIRECTORY  = path.join(BASE_DIRECTORY, 'packages');
const OUT_DIRECTORY  = path.join(BASE_DIRECTORY, 'out');

/**
 * Gulp tasks
 */

gulp.task('copy-package-assets', function() {
  return gulp.src(path.join(PACKAGE_DIRECTORY, '**'))
  .pipe(gulp.dest(OUT_DIRECTORY));
});
