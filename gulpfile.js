const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const responsive = require('gulp-responsive');

gulp.task('serve', () => {
  browserSync.init({
      server: "./"
  });
  gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch("css/*.css").on('change', browserSync.reload);
  gulp.watch("js/*.js").on('change', browserSync.reload);
});

gulp.task('views', () => {
  return gulp.src(['*.html', '*.php', '*.ico'])
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('img/*.*')
    .pipe(gulp.dest('dist/img'));
});

/* https://github.com/mahnunchik/gulp-responsive/blob/master/examples/multiple-resolutions.md */
gulp.task('responsive-images', () => {
  return gulp.src('img/*.{jpg,png}')
    .pipe(responsive({
      // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
      '*.jpg': [{
        width: 300,
        rename: { suffix: '-a' },
      }, {
        width: 330,
        rename: { suffix: '-b' },
      }, {
        width: 360,
        rename: { suffix: '-c' },
      }, {
        width: 420,
        rename: { suffix: '-d' },
      }]
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 70,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
    }))
    .pipe(gulp.dest('img'));
});
