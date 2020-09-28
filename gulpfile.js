let project_folder = 'build';
let source_folder = 'src';

let path = {
	build: {
		html: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		img: project_folder + '/img/',
		fonts: project_folder + '/fonts/',
	},
	src: {
		html: [source_folder + '/html/*.html', "!" + source_folder + '/**/_*.html'],
		pug: [source_folder + '/pug/pages/*.pug', "!" + source_folder + '/**/_*.pug'],
		css: source_folder + '/scss/style.scss',
		js: source_folder + '/js/script.js',
		img: source_folder + '/img/**/*.{png,jpeg,jpg,svg,gif,ico,webp}',
		fonts: source_folder + '/fonts/*.{woff,woff2,ttf,svg}',
	},
	watch: {
		html: source_folder + '/**/*.html',
		pug: source_folder + '/**/*.pug',
		css: source_folder + '/scss/**/*.scss',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/img/**/*.{png,jpeg,jpg,svg,gif,ico,webp}',
	},
	clean: './' + project_folder + '/'
}

//Объявляем переменные
let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(), //Инициализация локального сервера
	fileinclude = require('gulp-file-include'), // Для подключения файлов друг в друга
	del = require('del'), //Удаление папки build
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html'),
	// webpcss = require('gulp-webp-css'),
	svgSprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	pug = require('gulp-pug'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	babel = require('gulp-babel');

function browserSync() {
	browsersync.init({
		server: {
			baseDir: './' + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

function pug2html() {
	return src(path.src.pug)
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}


function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(
			group_media()
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true
			})
		)
		// .pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
		.pipe(fileinclude({ prefix: '@@' }))
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function js_copy() {
	return src(path.watch.js)
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 100
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

function svgsprite() {
	return gulp.src([source_folder + '/img/icons/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../img/icons/icons.svg",
				}
			},
		}))
		.pipe(dest(path.build.img))
}

function watchFiles(params) {
	gulp.watch([path.watch.pug], pug2html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(svgsprite, images, js, js_copy, css, pug2html, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.pug2html = pug2html;
exports.fonts = fonts;
exports.svgsprite = svgsprite;
exports.images = images;
exports.js_copy = js_copy;
exports.js = js;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;