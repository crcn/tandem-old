require('reflect-metadata');
const fs            = require('fs');
const fsa           = require('fs-extra');
const exec          = require('child_process').exec;
const gulp          = require('gulp');
const deleteEmpty   = require('delete-empty');
const sift          = require('sift');
const glob          = require('glob');
const mocha         = require('gulp-mocha');
const chalk         = require('chalk');
const zip           = require('gulp-vinyl-zip');
const install       = require('gulp-install');
const istanbul      = require('gulp-istanbul');
const peg           = require('gulp-peg');
const webpack       = require('webpack');
const chokidar      = require('chokidar');
const gutil         = require('gulp-util');
const notify        = require('gulp-notify');
const symdest       = require('gulp-symdest');
const rename        = require('gulp-rename');
const named         = require('vinyl-named');
const electron      = require('gulp-atom-electron');
const vfs           = require('vinyl-fs');
const gulpSequence  = require('gulp-sequence');
const _             = require('highland');

const { spawn }                   = require('child_process');
const { merge, omit }             = require('lodash');
const { join, dirname, basename } = require('path');

const {
  GREP,
  argv,
  WATCH,
  SRC_DIR,
  OUT_DIR,
  PACKAGES,
  BASE_DIR,
  DIST_DIR,
  PACKAGE_NAMES,
  INTEGRATIONS_DIR,
  NODE_MODULES_DIR,
  MONO_PKG_FILE_PATH,
  OUT_NODE_MODULES_DIR,
} = require('./config');

/******************************
 * Default tasks
 ******************************/

gulp.task('default', ['build']);

/******************************
 * Build tasks
 ******************************/

const buildTasks = [
  'build:peg',
  'build:typescript',
  'build:symlinks',
  'build:electron'
];

gulp.task('build', WATCH ? gulpSequence('prepare', buildTasks) : gulpSequence('prepare', ...buildTasks));
gulp.task('build:dist', gulpSequence('prepare', ...buildTasks, 'build:electron:dist'));

gulp.task('build:typescript', function(done) {
  const proc = spawn('node_modules/.bin/tsc', ['--declaration', '--pretty'].concat(WATCH ? '--watch' : []), {
    cwd: BASE_DIR
  });
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('exit', done);
});

gulp.task('build:peg', function() {
  return gulp
  .src(join(SRC_DIR, '**', '*.peg'))
  .pipe((peg()))
  .pipe(rename((file) => {
    file.extname = '.peg.js';
  }))
  .pipe(gulp.dest(OUT_DIR));
});

gulp.task('build:symlinks', () => {
  return gulp
  .src(join(OUT_DIR, '*'))
  .pipe(vfs.symlink(NODE_MODULES_DIR));
});

gulp.task('build:electron', gulpSequence(
  'prepare:electron', 
  ['build:electron:browser', 'build:electron:server']
));

gulp.task('build:electron:dist', gulpSequence(
  'build:electron:package'
));

gulp.task('build:electron:browser', (done) => {
  const pkg = getElectronPackage();
  bundleElectron(join(SRC_DIR, pkg.name, pkg.entries.browser), require('./webpack/browser'), done);
});

gulp.task('build:electron:server', (done) => {
  const pkg = getElectronPackage();
  bundleElectron(join(SRC_DIR, pkg.name, pkg.entries.server), require('./webpack/node').create(getElectronBundleDir() + "/node_modules"), done);
});

const PLATFORM_LABELS = {
  linux: 'linux',
  darwin: 'osx',
  win32: 'win'
};

gulp.task('build:electron:package', () => {

  try {
    fsa.removeSync(join(getElectronBundleDir(), "zip"));
  } catch(e) { }

  try {
    fsa.removeSync(join(getElectronBundleDir(), "app"));
  } catch(e) { }

  const electronPackage = getElectronPackage();

  const appVersion = electronPackage.version;

  const version = electronPackage.electronVersion;
  const platform = process.platform;
  const productName = electronPackage.productName;
  const arch = process.env.ELECTRON_PLATFORM || (platform === 'win32' ? 'ia32' : process.arch)
  
  const token = process.env.GITHUB_TOKEN;

  console.log(`electron version: ${version}; platform: ${platform}; arch: ${arch}`);

  let stream = gulp.src(join(getElectronBundleDir(), "**"))
  .pipe(electron({ version, platform, arch, token, productName }))

  if (process.env.SYMDEST) {
    stream = stream.pipe(symdest(join(getElectronBundleDir(), "app")));
  } else {
    stream = stream.pipe(zip.dest(join(getElectronBundleDir(), `zip/tandem-${appVersion}-${PLATFORM_LABELS[platform]}-${arch}.zip`)));
  }

  return stream;
});


/******************************
 * Prepare tasks
 ******************************/

gulp.task('prepare', gulpSequence(
  'prepare:copy-assets',
  'prepare:mono-package',
  'prepare:integrations'
));

gulp.task('prepare:copy-assets', ['prepare:copy-d-ts-assets'], () => {
  return gulp.src(join(SRC_DIR, '**', '!(*.ts|*.peg)'))
  .pipe(gulp.dest(OUT_DIR));
});

gulp.task('prepare:copy-d-ts-assets', () => {
  return gulp.src(join(SRC_DIR, '**', '*.d.ts'))
  .pipe(gulp.dest(OUT_DIR));
});


gulp.task('prepare:electron', gulpSequence(

  // clean electron node_modules to prevent stale local @tandem dependencies 
  'clean:electron',
  'prepare:electron:create-bundle-out',
  'prepare:electron:clean-empty-dirs',
  'prepare:electron:install'
));

gulp.task('prepare:electron:create-bundle-out', () => {
  const electronDir = join(OUT_DIR, getElectronPackage().name);
  const electronSrcDir = join(SRC_DIR, getElectronPackage().name);
  const bundleDir = getElectronBundleDir(); 
  fsa.mkdirpSync(bundleDir);

  return gulp.src(join(electronSrcDir, '**', '!(*.js|*.ts)'))
  .pipe(gulp.dest(bundleDir));
});


gulp.task('prepare:electron:clean-empty-dirs', () => {
  deleteEmpty.sync(getElectronBundleDir());
});

gulp.task('prepare:electron:install', () => {
  return gulp.src(join(getElectronBundleDir(), "package.json"))
  .pipe(install());
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

  const { dependencies, devDependencies } = merge({}, ...PACKAGES);

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


gulp.task('prepare:integrations', [
  'prepare:vscode-extension'
]);

gulp.task('prepare:vscode-extension', [
  'prepare:vscode-extension-symlinks'
]);

gulp.task('prepare:vscode-extension-symlinks', () => {
  return gulp
  .src(join(OUT_DIR, '*'))
  .pipe(vfs.symlink(join(INTEGRATIONS_DIR, 'tandem-vscode-extension', 'node_modules')));
});

/******************************
 * Publish tasks
 ******************************/

gulp.task('publish:npm', ['prepare:copy-assets'], () => {

  const publicPackages = PACKAGES.filter((pkg) => {
    return !pkg.private;
  });

  return _(publicPackages)
  .each((pkg) => {
    console.log("publishing %s", pkg.name);
    // console.log(join(OUT_DIR, dirname(pkg.path)));
    return spawn(`npm`, ['publish', '--access', 'public'], {
      cwd: dirname(pkg.path).replace(SRC_DIR, OUT_DIR),
      stdi: ['inherit', 'inherit', 'inherit']
    });
  });
});

gulp.task('bump', () => {
  return _(PACKAGES)
  .each((pkg) => {
    console.log("bumping %s", pkg.name);
    return spawn(`npm`, ['version', 'patch'], {
      cwd: dirname(pkg.path),
      stdio: ['inherit', 'inherit', 'inherit']
    });
  });
});

/******************************
 * Clean tasks
 ******************************/

gulp.task('clean', gulpSequence(
  'clean:out',
  'clean:symlinks'
));

gulp.task('clean:javascript', function() {
  glob.sync(join(OUT_DIR, `{${PACKAGE_NAMES.join(',')}}`, '**', '*.js'))
  .forEach((filePath) => {
    fsa.removeSync(filePath);
  });
});

gulp.task('clean:electron', function() {
  fsa.removeSync(getElectronBundleDir());
});


gulp.task('clean:out', function() {
  fsa.removeSync(OUT_DIR);
});

gulp.task('clean:mono-package', function() {
  fsa.removeSync(OUT_NODE_MODULES_DIR);
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

gulp.task('publish:all', ['test'], function() {

});

gulp.task('publish', function() {
  // inquier here about what package to publish
});

/******************************
 * Test tasks
 ******************************/

gulp.task('test', ['test:flag', 'test:all']);

gulp.task('test:flag', () => {
  process.env.TESTING   = true;
  process.env.SOURCE_MAPS = 1;
  process.env.SANDBOXED = true;
});

let coverageVariable;

gulp.task('hook:istanbul', function() {
  if (!argv.coverage) return;
  coverageVariable = '$$cov_' + new Date().getTime() + '$$';
  return gulp
  .src(getPackageOutDirs().map(dir => join(dir, '**', '*.js')))
  .pipe(istanbul())
  .pipe(istanbul.hookRequire());
});

gulp.task('test:all', ['hook:istanbul'], function(done) {
  const packageDirs = getPackageOutDirs();
  const testFiles = packageDirs.map(dir => join(dir, '**', '*-test.js'));

  let running = false;

  function run() {
    if (running) return;
    running = true;
    let stream = gulp
    .src(testFiles)
    .pipe(mocha({
      reporter: argv.reporter || 'dot',
      timeout: argv.timeout || 1000 * 5,
      grep: GREP,
      bail: argv.bail
    }))

    .on('error', error => console.error(error.stack))
    .on('error', notify.onError({ message: `Error: <%= error.message %>`, title: `Error running tests` }));

    if (argv.coverage) {
      stream = stream
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({
        coverageVariable: coverageVariable,
        reporters: ['lcov', 'text-summary', 'html'],
        thresholds: {
          global: Number(argv.coverage) || 0
        }
      }))
    }

    stream.once("end", () => running = false);

    return stream;
  }

  if (WATCH) {
    const watcher = chokidar.watch(packageDirs.map(dir => join(dir, '**', '*.js')), {
      usePolling: false,
      alwaysStat: true
    });
    watcher.on("change", run);
    run();
  } else {
    return run();
  }
});

/******************************
 * Utilities
 ******************************/

function bundleElectron(entry, config, done) {
  bundle(entry, Object.assign({}, config, {
    output: {
      path: dirname(entry.replace(SRC_DIR + "/" + getElectronPackage().name, getElectronBundleDir()))
    }
  }), done);
}

function bundle(srcEntryPath, config, done) {
   const outDir  = dirname(srcEntryPath.replace(SRC_DIR, OUT_DIR));
   const outBasename = basename(srcEntryPath.replace(/\.(js|ts)$/, ".bundle.js"));

   webpack(Object.assign({}, config, {
    entry: srcEntryPath,
    output: {
      path: config.output && config.output.path || outDir,
      filename: outBasename
    }
   }), (err, stats) => {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString(config.stats));
    if (!WATCH) {
      done();
    }
  });
}

function getPackageOutDirs() {
  return PACKAGE_NAMES.map(name => join(OUT_DIR, name));
}

function noop() { }

function getElectronBundleDir() {
  return join(DIST_DIR);
}

function getElectronPackage() {
  return PACKAGES.find(sift({ 'electronVersion': { $exists: true }}));
}


gulp.on('stop', () => {
  if (!WATCH) process.exit();
});