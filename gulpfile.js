//Libraries

const gulp = require('gulp');
const del = require("del")
const fs = require("fs")

//CSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const scss = require('gulp-sass');
scss.compiler = require('node-sass');
//Templates
const twig = require('gulp-twig');
//Javascript
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename")
const es = require("event-stream")



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

let jsConvert = (done) => {
	var fileArray = [
		'./app/scripts/main.js',
	];
	
	var pagesFilePrefix = './app/scripts/pages/';


	fs.readdir('./app/scripts/pages/', (err, files) => {
		files.forEach(file => {
			fileArray.push(pagesFilePrefix + file);
			
		})
		var tasks = fileArray.map(function(entry) {
			return browserify({
				entries: [entry],
				transform: [babelify.configure({presets:['@babel/preset-env']})]
			})
			.bundle()
			.pipe(source(entry.replace('./app/scripts/','').replace('.js','').replace('pages/','')))
			.pipe(rename({
				extname: '.bundle.js'
			}))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./dist/scripts'))
		});
		es.merge.apply(null, tasks);
	});

    // map them to our stream function
    
	done();
};

let cleanTMP = () => {
	return del('./.tmp')
}

let cleanDIST = () => {
	return del('./dist')
}


exports.templates = templatesTask
exports.css = cssTask
exports.scss = scssTask
exports.clean = cleanTMP
exports.build = gulp.series(cleanDIST,templatesTask,scssTask,cssTask,jsConvert,cleanTMP)