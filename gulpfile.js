const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const usemin = require('gulp-usemin');
const rev = require('gulp-rev');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();

gulp.task('lint', () => {
    return gulp.src(["src/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('clean', () => {
    return del(['build/']);
});

gulp.task('usemin', ['lint'], () => {
    return gulp.src('./src/index.html')
        .pipe(usemin({
            css: [cleanCSS(), rev()],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('browser-sync', ['default'],() => {
    const files = [
        "src/**/*.js",
        "src/**/*.css",
        "build/**/*"
    ];

    browserSync.init(files, {
        server: "./build"
    });

    gulp.watch(['build/**']).on('change', browserSync.reload);
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('{src/**/*.js,src/**/*.css,src/**/*.html}', ['usemin']);
});

gulp.task('default', ['clean'], () => {
    gulp.start('usemin');
});