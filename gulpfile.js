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


const PROD = 'prod';
const DEV = 'dev';
const ENV = getEnv();

var allJsSources = 'js/**/*.js';
var allCssSources = 'css/**/*.css';
var allHtmlSources = 'index.html';
var allPartialHtmlSources = 'partials/**/*.html';
var buildDir = './build/' + ENV;


gulp.task('default', ['connect', 'watch']);

gulp.task('js', ['js:' + ENV], function() {
  return gulp.run('file-size:build-js');
});

gulp.task('js:prod', function () {
  return gulp.src([
    'bower_components/angular/angular.min.js',
    'bower_components/angular-aria/angular-aria.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/hammerjs/hammer.min.js',
    'bower_components/angular-material/angular-material.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-google-maps/dist/angular-google-maps.min.js',
    allJsSources
  ])
      .pipe(size({showFiles: true, title: 'js: not minimized'}))
      .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(concat('build.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(size({showFiles: false, title: 'js: minimized (including the sourcemap)'}))
      .pipe(gulp.dest(buildDir))
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('js:dev', function () {
  return gulp.src([
    'bower_components/angular/angular.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-google-maps/dist/angular-google-maps.js',
    allJsSources
  ])
      .pipe(size({showFiles: true, title: 'js: not minimized'}))
      .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(concat('build.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildDir))
      .pipe(size({showFiles: false, title: 'js: minimized (including the sourcemap)'}))
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('html', function(cb) {
  fs.readFile('./.GOOGLE_API_KEY', 'utf8', function (err, googleApiKey) {
    if (err) {
      return console.log(err);
    }

    var stream = gulp.src([allHtmlSources])
        .pipe(replace('GOOGLE_API_KEY', googleApiKey))
        .pipe(gulp.dest(buildDir));

    stream.on('end', function() {
      cb();
    });
    stream.on('error', function(err) {
      gutil.log('error', err);
      cb(err);
    });
  });
});

gulp.task('html:partials', function() {
  return gulp.src([allPartialHtmlSources])
      .pipe(gulp.dest(buildDir + '/partials'))
      .on('error', gutil.log);
});

gulp.task('css', function() {
  return gulp.src([
      'bower_components/angular-material/angular-material.css',
      'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.css',
      'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-maps.css',
      allCssSources
  ])
      .pipe(size({showFiles: true, title: 'css: not minimized'}))
      .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(concat('build.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildDir))
      .pipe(size({showFiles: false, title: 'css: minimized (including the sourcemap)'}))
      .pipe(connect.reload())
      .on('error', gutil.log);
});

gulp.task('connect', function() {
  connect.server({
    root: buildDir,
    livereload: true
  });
});

gulp.task('copy:angular-material-svg-sprites', function() {
  return gulp.src([
      'bower_components/material-design-icons/sprites/svg-sprite/*.svg'
  ])
      .pipe(gulp.dest(buildDir))
      .on('error', gutil.log);
});

gulp.task('build', ['js', 'html', 'html:partials', 'css', 'copy:angular-material-svg-sprites']);

gulp.task('watch', ['build'], function() {
  gulp.watch([allJsSources], ['js']);
  gulp.watch([allCssSources], ['css']);
  gulp.watch([allHtmlSources], ['html']);
  gulp.watch([allPartialHtmlSources], ['html:partials']);
});

gulp.task('file-size:build-js', function() {
  return gulp.src([
      buildDir + '/build.js'
  ])
      .pipe(size({showFiles: false, title: 'js: minimized (without the sourcemap)'}))
      .on('error', gutil.log);
});

gulp.task('file-size:build-css', function() {
  return gulp.src([
    buildDir + '/build.css'
  ])
      .pipe(size({showFiles: false, title: 'css: minimized (without the sourcemap)'}))
      .on('error', gutil.log);
});





function getEnv() {
  return gulp.env.build === PROD ? PROD : DEV;
}
