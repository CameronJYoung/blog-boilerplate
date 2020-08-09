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
	in : {
		app: './app',
		fonts: './app/fonts',
		imgs: './app/imgs',
		scripts: './app/scripts',
		styles: './app/styles/',
		templates: {
			include: './app/templates/includes',
			layout: './app/templates/layouts',
			page: './app/templates/pages'
		}
	},
	out : {
		tmp: './.tmp',
		dist: './dist',
		fonts: './dist/fonts',
		imgs: './dist/imgs',
		scripts: './dist/scripts',
		styles: './dist/styles'
	}
}



const templatesTask = () => {
	return gulp.src(`${paths.in.templates.page}/*.html`)
		.pipe(twig())
		.pipe(gulp.dest(`${paths.out.dist}/`))
		.pipe(browserSync.stream());

}

const scssTask = () => {
	return gulp.src(`${paths.in.styles}/**/*.scss`)
		.pipe(scss().on('error', scss.logError))
		.pipe(gulp.dest(`${paths.out.tmp}/styles/`))

}

const cssTask = () => {
	var processors = [
		autoprefixer({overrideBrowserslist: ['last 2 versions']}),
		cssnano()
	]
	return gulp.src(`${paths.out.tmp}/styles/**/*.css`)
		.pipe(postcss(processors))
		.pipe(gulp.dest(paths.out.styles))
		.pipe(browserSync.stream())

}

const jsConvert = (done) => {
	var fileArray = [
		`${paths.in.scripts}/main.js`
	];
	var pagesFilePrefix = `${paths.in.scripts}/pages/`;
	fs.readdir(pagesFilePrefix, (err, files) => {
		//if (err) done(err);
		files.forEach(file => {
			fileArray.push(pagesFilePrefix + file);
		})
		var tasks = fileArray.map((entry) => {
			return browserify({
				entries: [entry],
				transform: [babelify.configure({presets:['@babel/preset-env']})]
			})
			.bundle()
			.pipe(source(entry.replace(`${paths.in.scripts}/`,'').replace('.js','').replace('pages/','')))
			.pipe(rename({
				extname: '.bundle.js'
			}))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest(paths.out.scripts))
			.pipe(browserSync.stream())
		});
		es.merge.apply(null, tasks);
	});
    
	done();
};

const moveFontsTask = () => {
	return gulp.src(`${paths.in.fonts}/**/*.*`)
		.pipe(gulp.dest(paths.out.fonts));
}

const delOldFontsTask = () => {
	return del(paths.out.fonts)
}

const moveImgsTask = () => {
	return gulp.src(`${paths.in.imgs}/**/*.*`)
		.pipe(gulp.dest(paths.out.imgs))
}

const delOldImgsTask = () => {
	return del(paths.out.imgs)
}

const cleanTMP = () => {
	return del(paths.out.tmp)
}

const cleanDIST = () => {
	return del(paths.out.dist)
}

const serveTask = () => {
	browserSync.init({
        server: {
			baseDir: `${paths.out.dist}/`
        }
    });

	gulp.watch(`${paths.in.styles}/**/*`).on('change', gulp.series(scssTask,cssTask,cleanTMP));
	gulp.watch(`${paths.in.scripts}/**/*`).on('change',jsConvert);
	gulp.watch(`${paths.in.app}/templates/**/*`).on('change', templatesTask);
	gulp.watch(`${paths.in.fonts}/**/*`).on('change', gulp.series(delOldFontsTask,moveFontsTask,reload));
	gulp.watch(`${paths.in.imgs}/**/*`).on('change', gulp.series(delOldImgsTask,moveImgsTask,reload));
}




exports.default = gulp.series(cleanDIST,gulp.parallel(templatesTask,gulp.series(scssTask,cssTask),jsConvert,moveFontsTask,moveImgsTask),cleanTMP,serveTask) //Dupe of dev

exports.dev = gulp.series(cleanDIST,gulp.parallel(templatesTask,gulp.series(scssTask,cssTask),jsConvert,moveFontsTask,moveImgsTask),cleanTMP,serveTask)
exports.clean = cleanTMP
exports.js = jsConvert

exports.build = gulp.series(cleanDIST,gulp.parallel(templatesTask,gulp.series(scssTask,cssTask),jsConvert,moveFontsTask,moveImgsTask),cleanTMP)
