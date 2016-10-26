const fs            = require('fs');
const fsa           = require('fs-extra');
const exec          = require('child_process').exec;
const gulp          = require('gulp');
const sift          = require('sift');
const glob          = require('glob');
const chalk         = require('chalk');
const install       = require('gulp-install');
const peg           = require('gulp-peg');
const webpack       = require('gulp-webpack');
const symdest       = require('gulp-symdest');
const rename        = require('gulp-rename');
const electron      = require('gulp-atom-electron');
const vfs           = require('vinyl-fs');
const gulpSequence  = require('gulp-sequence');
const watch         = require('gulp-watch');
const _             = require('highland');

const { spawn }                   = require('child_process');
const { merge, omit }             = require('lodash');
const { join, dirname, basename } = require('path');

const {
  WATCH,
  SRC_DIR,
  OUT_DIR,
  PACKAGES,
  BASE_DIR,
  PACKAGE_NAMES,
  NODE_MODULES_DIR,
  MONO_PKG_FILE_PATH,
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
  'build:peg',
  'build:typescript',
  'build:webpack',
  'build:electron'
]);

gulp.task('build:typescript', function(done) {
  const proc = spawn('node_modules/.bin/tsc', ['--declaration'].concat(WATCH ? '--watch' : []), {
    cwd: BASE_DIR
  });
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('exit', done);
});

gulp.task('build:peg', function() {
  return gulp
  .src(join(SRC_DIR, "**", "*.peg"))
  .pipe((peg()))
  .pipe(rename((file) => {
    file.extname = ".peg.js";
  }))
  .pipe(gulp.dest(OUT_DIR));
});

gulp.task('build:webpack', function(done) {
  const webPackages = PACKAGES.filter(sift({ "entries.browser": { $exists: true }}));

  return _.pipeline(...webPackages.map((pkg) => {
    const srcFilePath = join(SRC_DIR, pkg.name, pkg.entries.browser);
    const outDir      = join(OUT_DIR, pkg.name, dirname(pkg.browser));

    // TODO: need to set the bundled browser entry JS name to the
    // base name of the browser file specified in the package.json.
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
  'prepare:mono-package',
  'prepare:symlinks'
));

gulp.task('prepare:copy-assets', () => {
  return gulp.src(join(SRC_DIR, '**', '!(*.ts|*.peg)'))
  .pipe(gulp.dest(OUT_DIR));
});

gulp.task('prepare:mono-package', gulpSequence(
  'prepare:create-mono-package',
  'prepare:install-mono-package'
));

/**
 * Creates a monolithic package of all the dependencies
 * required by all packages in the source directory.
 */

gulp.task('prepare:create-mono-package', () => {

  const { dependencies, devDependencies } = merge(...PACKAGES);

  // one mono package for everything to go under
  const monoPackage = {
    dependencies: omit(Object.assign({}, dependencies, devDependencies), PACKAGE_NAMES)
  };

  const monoPackageContent  = JSON.stringify(monoPackage, null, 2);

  fs.writeFileSync(MONO_PKG_FILE_PATH, monoPackageContent, 'utf8');
});

gulp.task('prepare:install-mono-package', ['clean:symlinks'], () => {
  return gulp
  .src(MONO_PKG_FILE_PATH)
  .pipe(gulp.dest(OUT_DIR))
  .pipe(install())
});

gulp.task('prepare:symlinks', ['clean:symlinks'], () => {
  return gulp
  .src(join(OUT_DIR, '*'))
  .pipe(vfs.symlink(NODE_MODULES_DIR));
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

gulp.task('clean:symlinks', function() {
  if (!fs.existsSync(NODE_MODULES_DIR)) return;
  fs.readdirSync(NODE_MODULES_DIR).forEach((dir) => {
    const filePath = join(NODE_MODULES_DIR, dir);
    if (fs.lstatSync(filePath).isSymbolicLink()) {
      fsa.removeSync(filePath);
    }
  });
});

/******************************
 * Publish tasks
 ******************************/

gulp.task('publish:all', function() {

});

gulp.task('publish', function() {
  // inquier here about what package to publish
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