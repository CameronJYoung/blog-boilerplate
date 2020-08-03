const gulp = require('gulp');
const twig = require('gulp-twig');

let templatesTask = (done) => {
	gulp.src('./app/templates/pages/*.html')
		.pipe(twig())
		.pipe(gulp.dest('dist'));
	done()
}


  
exports.templates = templatesTask