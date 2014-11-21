var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');


var allJsSources = 'js/**/*.js';

gulp.task('js', function () {
  gulp.src([
    'bower_components/angular/angular.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-google-maps/dist/angular-google-maps.js',
    allJsSources
  ])
      .pipe(sourcemaps.init())
      .pipe(concat('build.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('.'));
});

gulp.task('watch', ['js'], function () {
  gulp.watch(allJsSources, ['js']);
});
