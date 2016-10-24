const fs            = require('fs');
const fsa           = require('fs-extra');
const exec          = require('child_process').exec;
const gulp          = require('gulp');
const sift          = require('sift');
const glob          = require('glob');
const chalk         = require('chalk');
const install       = require('gulp-install');
const webpack       = require('gulp-webpack');
const symdest       = require('gulp-symdest');
const electron      = require('gulp-atom-electron');
const vfs           = require('vinyl-fs');
const gulpSequence  = require('gulp-sequence');

const { merge, omit }            = require('lodash');
const { join, dirname, basename } = require('path');
const {
  SRC_DIR,
  OUT_DIR,
  PACKAGES,
  PACKAGE_NAMES,
  MEGA_PKG_FILE_PATH,
  OUT_NODE_MODULES_DIR,
} = require('./config');


/******************************
 * Build tasks
 ******************************/

gulp.task('build', gulpSequence([
  'build-webpack',
  'build-electron'
]));

gulp.task('build-webpack', function() {
  const webpackPackages = PACKAGES.filter(sift({ browser: { $exists: true }}));

  return gulp
  .src(webpackPackages.map((pkg) => {
    return join(SRC_DIR, pkg.name, pkg.main)
  }))
  .pipe(webpack(require('./webpack.config.js')))
});

// TODO
gulp.task('build-electron');

/******************************
 * Prepare tasks
 ******************************/

gulp.task('prepare', gulpSequence(
  'copy-src-assets',
  'create-mega-package',
  'install-mega-package',
  'symlink-packages'
));

gulp.task('copy-src-assets', () => {
  return gulp.src(join(SRC_DIR, '**'))
  .pipe(gulp.dest(OUT_DIR));
});

/**
 * Installs all dependencies in *one* convenient location.
 */

gulp.task('create-mega-package', () => {

  const { dependencies, devDependencies } = merge(...PACKAGES);

  // one mega package for everything to go under
  const megaPackage = {
    dependencies: omit(Object.assign({}, dependencies, devDependencies), PACKAGE_NAMES)
  };

  const megaPackageContent  = JSON.stringify(megaPackage, null, 2);
  console.log('writing %s: ', MEGA_PKG_FILE_PATH, megaPackageContent);

  fs.writeFileSync(MEGA_PKG_FILE_PATH, megaPackageContent, 'utf8');
});

gulp.task('install-mega-package', () => {
  return gulp
  .src(MEGA_PKG_FILE_PATH)
  .pipe(gulp.dest(OUT_DIR))
  .pipe(install())
});

gulp.task('symlink-packages', () => {

  // TODO - possibly filter sources with package.json file in it
  return gulp
  .src(join(OUT_DIR, '*'))
  // .pipe(filter(['!node_modules']))
  .pipe(vfs.symlink(OUT_NODE_MODULES_DIR))
});

/******************************
 * Clean tasks
 ******************************/

gulp.task('clean', gulpSequence(
  'clean-out'
));

gulp.task('clean-out', function() {
  fsa.removeSync(OUT_DIR);
});

gulp.task('clean-out-dependencies', function() {
  fsa.removeSync(OUT_NODE_MODULES_DIR);
});

/******************************
 * Other tasks
 ******************************/

function readPackagePaths() {
  return ;
}

function readPackages() {

}