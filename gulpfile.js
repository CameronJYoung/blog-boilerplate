
//Libraries

const gulp = require('gulp');
const del = require("del")
const fs = require("fs")
const browserSync = require("browser-sync").create();

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
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());

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
		.pipe(browserSync.stream())

}

let jsConvert = (done) => {
	var fileArray = [
		'./app/scripts/main.js',
	];
	
	var pagesFilePrefix = './app/scripts/pages/';


	fs.readdir(pagesFilePrefix, (err, files) => {
		files.forEach(file => {
			fileArray.push(pagesFilePrefix + file);
			
		})
		var tasks = fileArray.map((entry) => {
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
			.pipe(browserSync.stream())
		});
		es.merge.apply(null, tasks);
	});
    
	done();
};

let cleanTMP = () => {
	return del('./.tmp')
}

let cleanDIST = () => {
	return del('./dist')
}

var reload = browserSync.reload


let serveTask = () => {
	browserSync.init({
        server: {
			baseDir: "./dist/"
        }
    });

	gulp.watch('./app/styles/**/*', gulp.series(scssTask,cssTask,cleanTMP));
	gulp.watch('./app/scripts/**/*', jsConvert);
	gulp.watch('./app/templates/**/*').on('change', templatesTask);
}















exports.clean = cleanTMP
exports.build = gulp.series(cleanDIST,templatesTask,scssTask,cssTask,jsConvert,cleanTMP)
exports.dev = gulp.series(cleanDIST,templatesTask,scssTask,cssTask,jsConvert,cleanTMP,serveTask)