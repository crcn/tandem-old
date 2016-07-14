var gulp     = require('gulp');
var karma    = require('karma');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var args = require('yargs').argv;
var runTimestamp = Math.round(Date.now()/1000);

gulp.task('icons', function() {
  return gulp.src(['src/editor/svg-icons/*.svg'])
    .pipe(iconfont({
      fontName: 'iconfont',
      appendUnicode: true,
      formats: ['ttf', 'eot', 'woff'],
      timestamp: runTimestamp
    }))
      .on('glyphs', function(glyphs) {
        gulp.src('src/editor/svg-icons/iconfonts.scss')
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          fontName: 'iconfont',
          fontPath: './',
          className: 's'
        }))
        .pipe(gulp.dest('src/editor/scss'));
      })
    .pipe(gulp.dest('src/editor/scss/'));
});
