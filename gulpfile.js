var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');

sass.compiler = require('node-sass');

gulp.task('sass', function() {
    return gulp.src('./src/sass/index.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});