const gulp = require('gulp');
const del = require("del")
const fs = require("fs")
const browserSync = require("browser-sync").create();
var reload = browserSync.reload
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const scss = require('gulp-sass');
scss.compiler = require('node-sass');
const twig = require('gulp-twig');
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename")
const es = require("event-stream")

const paths = {
	fonts: '',
	imgs: '',
	styles: '',
	templates: ''
}



const templatesTask = () => {
	return gulp.src('./app/templates/pages/*.html')
		.pipe(twig())
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());

}

const scssTask = () => {
	return gulp.src('./app/styles/**/*.scss')
		.pipe(scss().on('error', scss.logError))
		.pipe(gulp.dest('./.tmp/styles/'))

}

const cssTask = () => {
	var processors = [
		autoprefixer({overrideBrowserslist: ['last 2 versions']}),
		cssnano()
	]
	return gulp.src('./.tmp/styles/**/*.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('./dist/styles'))
		.pipe(browserSync.stream())

}

const jsConvert = (done) => {
	var fileArray = [
		'./app/scripts/main.js',
	];
	var pagesFilePrefix = './app/scripts/pages/';
	fs.readdir(pagesFilePrefix, (err, files) => {
		if (err) done(err);
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

const moveFontsTask = () => {
	return gulp.src('./app/fonts/**/*.*')
		.pipe(gulp.dest('./dist/fonts'));
}

const delOldFontsTask = () => {
	return del('./dist/fonts')
}

const moveImgsTask = () => {
	return gulp.src('./app/imgs/**/*.*')
		.pipe(gulp.dest('./dist/imgs'))
}

const delOldImgsTask = () => {
	return del('./dist/imgs')
}

const cleanTMP = () => {
	return del('./.tmp')
}

const cleanDIST = () => {
	return del('./dist')
}

const serveTask = () => {
	browserSync.init({
        server: {
			baseDir: "./dist/"
        }
    });

	gulp.watch('./app/styles/**/*').on('change', gulp.series(scssTask,cssTask,cleanTMP));
	gulp.watch('./app/scripts/**/*').on('change',jsConvert);
	gulp.watch('./app/templates/**/*').on('change', templatesTask);
	gulp.watch('./app/fonts/**/*').on('change', gulp.series(delOldFontsTask,moveFontsTask,reload));
	gulp.watch('./app/imgs/**/*').on('change', gulp.series(delOldImgsTask,moveImgsTask,reload));
}




exports.default = gulp.series(cleanDIST,gulp.parallel(templatesTask,gulp.series(scssTask,cssTask),jsConvert,moveFontsTask,moveImgsTask),cleanTMP,serveTask) //Dupe of dev

exports.dev = gulp.series(cleanDIST,gulp.parallel(templatesTask,gulp.series(scssTask,cssTask),jsConvert,moveFontsTask,moveImgsTask),cleanTMP,serveTask)
exports.clean = cleanTMP

exports.build = gulp.series(cleanDIST,gulp.parallel(templatesTask,gulp.series(scssTask,cssTask),jsConvert,moveFontsTask,moveImgsTask),cleanTMP)
