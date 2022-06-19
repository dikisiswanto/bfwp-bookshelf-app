const gulp = require('gulp');
const webserver = require('browser-sync');
const postcss = require('gulp-postcss');

const config = {
  server: {
    baseDir: './dist',
  },
  notify: false,
};

gulp.task('webserver', () => {
  webserver(config);
})

gulp.task('build:html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(webserver.reload({
      stream: true,
    }));
});

gulp.task('build:css', () => {
  return gulp.src('src/styles/*.css')
    .pipe(postcss())
    .pipe(gulp.dest('dist/css'))
    .pipe(webserver.reload({
      stream: true,
    }));
});

gulp.task('build:js', () => {
  return gulp.src('src/scripts/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(webserver.reload({
      stream: true,
    }));
})

gulp.task('watch', () => {
  gulp.watch('src/*.html', gulp.series(['build:html', 'build:css']));
  gulp.watch('src/**/*.css', gulp.series('build:css'));
  gulp.watch('src/**/*.js', gulp.series(['build:css', 'build:js']));
});

gulp.task('build', gulp.series(['build:html', 'build:css', 'build:js']));

gulp.task('default', 
  gulp.series(
    'build',
    gulp.parallel(
      'webserver',
      'watch')
  ));