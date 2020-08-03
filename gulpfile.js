const gulp = require('gulp');
const twig = require('gulp-twig');
const scss = require('gulp-sass');

scss.compiler = require('node-sass');

let templatesTask = (done) => {
	gulp.src('./app/templates/pages/*.html')
		.pipe(twig())
		.pipe(gulp.dest('dist'));
	done()
}

let scssConversionTask = (done) => {
	gulp.src('./app/**/**/**.scss')
		.pipe(scss().on('error', scss.logError))
		.pipe(gulp.dest('dist/css'));
	done()
}

  
exports.templates = templatesTask
exports.scss = scssConversionTask