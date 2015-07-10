var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var size = require('gulp-size');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var fs = require('fs');
var htmlreplace = require('gulp-html-replace');
var minifyCSS = require('gulp-minify-css');
var gulpif = require('gulp-if');

var config = require('./.config.json');


const PROD = 'prod';
const DEV = 'dev';
const ENV = getEnv();

var allJsSources = 'js/**/*.js';
var allCssSources = 'css/**/*.css';
var allHtmlSources = 'index.html';
var allPartialHtmlSources = 'partials/**/*.html';
var buildDir = './build/' + ENV;


gulp.task('default', ['connect', 'watch']);

gulp.task('js', ['new:js'], function () {
  return gulp.run('file-size:build-js');
});

gulp.task('new:js', function () {
  var sources = [];
  if (ENV === DEV) {
    sources = [
      'node_modules/lodash/lodash.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-google-maps/dist/angular-google-maps.js',
      'node_modules/angularfire/node_modules/firebase/lib/firebase-web.js',
      'node_modules/angularfire/dist/angularfire.js',
      allJsSources
    ];
  } else if (ENV === PROD) {
    sources = [
      'node_modules/lodash/lodash.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-aria/angular-aria.min.js',
      'node_modules/angular-animate/angular-animate.min.js',
      'node_modules/angular-material/angular-material.min.js',
      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
      'node_modules/angular-google-maps/dist/angular-google-maps.min.js',
      'node_modules/angularfire/node_modules/firebase/lib/firebase-web.js',
      'node_modules/angularfire/dist/angularfire.min.js',
      allJsSources
    ];
  } else {
    gutil.log('should have an valid ENV');
    return;
  }
  return gulp.src(sources, {base: '.'})
      .pipe(size({showFiles: true, title: 'js: not minimized'}))
      .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(replace('GOOGLE_API_KEY', config.google_api_key))
      .pipe(gulpif(ENV === PROD, concat('build.js')))
      .pipe(gulpif(ENV === PROD, ngAnnotate()))
      .pipe(gulpif(ENV === PROD, uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(size({showFiles: false, title: 'js: minimized (including the sourcemap)'}))
      .pipe(gulp.dest(buildDir))
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('html', function (cb) {
  return gulp.src([allHtmlSources])
      .pipe(replace('GOOGLE_API_KEY', config.google_api_key))
      .pipe(gulpif(ENV === PROD, htmlreplace({
        'css': 'build.css',
        'js': 'build.js'
      }), htmlreplace({
        'css': 'build.css'
      }, {
        'keepUnassigned': true
      })))
      .pipe(gulp.dest(buildDir));
});

gulp.task('html:partials', function () {
  return gulp.src([allPartialHtmlSources])
      .pipe(gulp.dest(buildDir + '/partials'))
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('css', function () {
  return gulp.src([
    'node_modules/angular-material/angular-material.css',
    'node_modules/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.css',
    'node_modules/material-design-icons/sprites/svg-sprite/svg-sprite-maps.css',
    'node_modules/material-design-icons/sprites/svg-sprite/svg-sprite-action.css',
    allCssSources
  ])
      .pipe(size({showFiles: true, title: 'css: not minimized'}))
      .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(concat('build.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulpif(ENV === PROD, minifyCSS()))
      .pipe(gulp.dest(buildDir))
      .pipe(size({showFiles: false, title: 'css: minimized (including the sourcemap)'}))
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('connect', function () {
  connect.server({
    root: buildDir,
    livereload: true
  });
});

gulp.task('build', ['js', 'html', 'html:partials', 'css']);

gulp.task('watch', ['build'], function () {
  gulp.watch([allJsSources], ['js']);
  gulp.watch([allCssSources], ['css']);
  gulp.watch([allHtmlSources], ['html']);
  gulp.watch([allPartialHtmlSources], ['html:partials']);
});

gulp.task('file-size:build-js', function () {
  return gulp.src([
    buildDir + '/build.js'
  ])
      .pipe(size({showFiles: false, title: 'js: minimized (without the sourcemap)'}))
      .on('error', gutil.log);
});

gulp.task('file-size:build-css', function () {
  return gulp.src([
    buildDir + '/build.css'
  ])
      .pipe(size({showFiles: false, title: 'css: minimized (without the sourcemap)'}))
      .on('error', gutil.log);
});


function getEnv() {
  return gulp.env.build === PROD ? PROD : DEV;
}
