'use strict';

var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	prefix		= require('gulp-autoprefixer'),
	minifyCSS 	= require('gulp-minify-css'),
	connect 	= require('gulp-connect'),
	live 		= require('gulp-livereload'),
	plumber 	= require('gulp-plumber'),
	imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
	concat 		= require('gulp-concat'),
	browserSync	= require('browser-sync'),
	notify 		= require('gulp-notify');
		
gulp.task('connect', function() {
  connect.server({
    root: 'production', 
    livereload: true
  });
});

gulp.task('browser-sync', function() {
    browserSync({
        proxy: "lopart.192.168.0.101.xip.io"
    });
});

gulp.task('images', function() {
    return gulp.src('dev/design/images/**/*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('production/design/images/')); // Выгружаем на продакшен

});
	
gulp.task('html', function () {
	gulp.src('dev/index.html')
	.pipe(gulp.dest('production/'))
});
	
gulp.task('css', function () {
	gulp.src('dev/design/scss/**/*.scss')
	.pipe(plumber())
	.pipe(sass())
	.pipe(prefix('last 15 versions'))
	.pipe(minifyCSS(''))
	.pipe(concat('style.css'))
	.pipe(plumber.stop())
	.pipe(gulp.dest('production/design/css'));
	
});

gulp.task('watch', function() {
	gulp.watch('dev/design/scss/**/*.scss', ['css', browserSync.reload])
	gulp.watch('dev/index.html', ['html', browserSync.reload])
	gulp.watch('dev/design/images/*', ['images', browserSync.reload])
});

gulp.task('default', ['watch', 'browser-sync', 'css', 'html', 'images']);