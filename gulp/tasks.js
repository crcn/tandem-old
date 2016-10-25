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
const ts            = require('gulp-typescript');
const electron      = require('gulp-atom-electron');
const vfs           = require('vinyl-fs');
const gulpSequence  = require('gulp-sequence');
const watch         = require('gulp-watch');
const _             = require('highland');

const { merge, omit }            = require('lodash');
const { join, dirname, basename } = require('path');
const {
  WATCH,
  SRC_DIR,
  OUT_DIR,
  PACKAGES,
  BASE_DIR,
  PACKAGE_NAMES,
  MEGA_PKG_FILE_PATH,
  OUT_NODE_MODULES_DIR,
} = require('./config');

/******************************
 * Default tasks
 ******************************/

gulp.task('default', gulpSequence('prepare', 'build'));

/******************************
 * Build tasks
 ******************************/

gulp.task('build', [
  'build:typescript',
  'build:webpack',
  'build:electron'
]);

gulp.task('build:typescript', function buildTS(done) {

  const TS_SRC_FILES = join(SRC_DIR, '**', '*.ts');

  function build(done) {
    const tsProject = ts.createProject('tsconfig.json');

    const tsResult = gulp.src(TS_SRC_FILES)
    .pipe(tsProject());

    _.pipeline(
      tsResult.dts.pipe(gulp.dest(OUT_DIR)),
      tsResult.js.pipe(gulp.dest(OUT_DIR))
    ).done(done);
  }

  if (WATCH) {
    gulp.watch(TS_SRC_FILES, () => build(noop));
    build(noop);
  } else {
    build(done);
  }
});

gulp.task('build:webpack', function(done) {
  const webPackages = PACKAGES.filter(sift({ browser: { $exists: true }}));

  return _.pipeline(...webPackages.map((pkg) => {
    const srcFilePath = join(SRC_DIR, pkg.name, pkg.entry);
    const outDir      = join(OUT_DIR, pkg.name, dirname(pkg.browser));

    return gulp
    .src(srcFilePath)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(outDir));
  }));
});

// TODO
gulp.task('build:electron');

/******************************
 * Prepare tasks
 ******************************/

gulp.task('prepare', gulpSequence(
  'prepare:copy-assets',
  'prepare:create-mega-package',
  'prepare:install-mega-package',
  'prepare:symlinks'
));

gulp.task('prepare:copy-assets', () => {
  return gulp.src(join(SRC_DIR, '**', '!(*.ts)'))
  .pipe(gulp.dest(OUT_DIR));
});

/**
 * Installs all dependencies in *one* convenient location.
 */

gulp.task('prepare:create-mega-package', () => {

  const { dependencies, devDependencies } = merge(...PACKAGES);

  // one mega package for everything to go under
  const megaPackage = {
    dependencies: omit(Object.assign({}, dependencies, devDependencies), PACKAGE_NAMES)
  };

  const megaPackageContent  = JSON.stringify(megaPackage, null, 2);

  fs.writeFileSync(MEGA_PKG_FILE_PATH, megaPackageContent, 'utf8');
});

gulp.task('prepare:install-mega-package', () => {
  return gulp
  .src(MEGA_PKG_FILE_PATH)
  .pipe(gulp.dest(OUT_DIR))
  .pipe(install())
});

gulp.task('prepare:symlinks', () => {
  return gulp
  .src(join(OUT_DIR, '*'))
  .pipe(vfs.symlink(OUT_NODE_MODULES_DIR))
});

/******************************
 * Clean tasks
 ******************************/

gulp.task('clean', gulpSequence(
  'clean:out'
));

gulp.task('clean:out', function() {
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

function noop() { }