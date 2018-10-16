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
    .pipe($.responsive({
      // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
      '*.jpg': [{
        width: 200,
        rename: { suffix: '-200px' },
      }, {
        width: 500,
        rename: { suffix: '-500px' },
      }, {
        width: 630,
        rename: { suffix: '-630px' },
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '-original' },
      }],
      // Resize all PNG images to be retina ready
      '*.png': [{
        width: 250,
      }, {
        width: 250 * 2,
        rename: { suffix: '@2x' },
      }],
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
