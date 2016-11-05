var gulp = require('gulp'),
    babel = require('gulp-babel'),
    traceur = require('gulp-traceur'),
    sass = require('gulp-sass'),
    del = require('del'),
    gls = require('gulp-live-server');

var TRACEUR_OPTIONS = {
  experimental: true,
  annotations: true,
  memberVariables: true,
  typeAssertions: true,
  typeAssertionModule: 'rtts_assert/rtts_assert',
  types: true,
  modules: 'instantiate'
};

// Transpile
gulp.task('transpile', function () {
  return gulp.src('app/**/*.js')
    .pipe(traceur(TRACEUR_OPTIONS))
    .pipe(gulp.dest('dist'));
});

// Copy:html
gulp.task('copy:html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Sass
gulp.task('sass', function () {
  gulp.src('app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

// Serve
gulp.task('serve', function (cb) {
  var server = gls.static('/', 3000); 
  server.start();
  
  gulp.watch('dist/**/*.*', function (file) {
    server.notify.apply(server, [file]);
  });
});

// Watch
gulp.task('watch', function () {
  // Watch for sass files changes
  gulp.watch('app/**/*.scss', function(file) {
    gulp.src(file.path, { base: 'app'})
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist'));
  });

  // Watch for html files changes
  gulp.watch('app/**/*.html', function(file) {
    gulp.src(file.path, { base: 'app'})
      .pipe(gulp.dest('dist'));
  });

  // Watch for js files changes
  gulp.watch('app/**/*.js', function(file) {
      gulp.src(file.path, { base: 'app'})
        .pipe(traceur(TRACEUR_OPTIONS))
        .pipe(gulp.dest('dist'));
  });
});

// Clean
gulp.task('clean', function () {
  return del('dist');
});

gulp.task('default', ['transpile', 'copy:html', 'sass']);