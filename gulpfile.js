var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

// clean dist directory
gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false, force: true})
    .pipe(clean());
});

// js
gulp.task('dist', ['clean'], function () {
  return gulp.src([
    'src/polyfills.js',
    'src/big-list.js',
    'src/big-table.js'
  ])
  .pipe(concat('big-table.js'))
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'dist']);
