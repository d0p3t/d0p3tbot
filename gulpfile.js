var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');

gulp.task('scripts', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(livereload());
});

gulp.task('css',function(){
    return gulp.src('public/css/*.css')
    //.pipe(postcss([ autoprefixer() ]))
    .pipe(livereload());
});

gulp.task('pug',function(){
    return gulp.src('views/**/*.pug')
    .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/css/**/*.scss', ['styles']);
    gulp.watch('public/js/*.js', ['scripts']);
    gulp.watch('views/**/*.pug', ['pug']);
});

gulp.task('server',function(){
    nodemon({
        'script': 'server.js',
        'ignore': 'public/js/*.js'
    });
});

gulp.task('serve', ['server','watch']);
