const gulp = require('gulp');
const twig = require('gulp-twig');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const scss = require('gulp-sass');
const babel = require('gulp-babel');

scss.compiler = require('node-sass');


let templatesTask = () => {
	return gulp.src('./app/templates/pages/*.html')
		.pipe(twig())
		.pipe(gulp.dest('./dist'));

}

let scssTask = () => {
	return gulp.src('./app/styles/**/*.scss')
		.pipe(scss().on('error', scss.logError))
		.pipe(gulp.dest('./.tmp/styles/'))

}

let cssTask = () => {
	var processors = [
		autoprefixer({overrideBrowserslist: ['last 2 versions']}),
		cssnano()
	]
	return gulp.src('./.tmp/styles/**/*.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('./dist/styles'))

}

let jsConvert = () => {
	return gulp.src('./app/scripts/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('./dist/scripts'))
}


exports.templates = templatesTask
exports.css = cssTask
exports.scss = scssTask
exports.build = gulp.series(templatesTask,scssTask,cssTask,jsConvert)