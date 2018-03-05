import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import minify from 'gulp-clean-css';
import cheerio from 'cheerio';
import htmlreplace from 'gulp-html-replace';
import versionNumber from 'gulp-version-number';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import cssUrlVersion from 'gulp-make-css-url-version';
import del from 'del';
import fs from 'fs';

const versionConfig = {
	'value': '%DATE%',
	'append': {
		'key': 'v',
		'to': ['css', 'js', 'image'],
	},
};

const $ = cheerio.load(fs.readFileSync('./index.html', 'utf8'));
let css = [];
let js = [];

$('link').each((i, tag) => {
	if (tag.attribs.rel === 'stylesheet') {
		css.push(tag.attribs.href);
	}
});

$('script').each((i, tag) => {
	if (tag.attribs.src && -1 === tag.attribs.src.indexOf('http') && -1 === tag.attribs.src.indexOf('//')) {
		js.push(tag.attribs.src);
	}
});

gulp.task('clean', function () {
	return del(['build/app.js', 'build/app.css', 'index.min.html']);
});

gulp.task('js', function () {
	return gulp.src(js)
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

gulp.task('css-concat', function () {
	return gulp.src(css)
		.pipe(concat('app-concat.css'))
		.pipe(gulp.dest('build'));
});

gulp.task('css-version-minify', ['css-concat'], function () {
	gulp.src('build/app-concat.css')
		.pipe(cssUrlVersion({useDate: true, format: 'yyyyMMddhhmmss'}))
		.pipe(minify({keepBreaks: true}))
		.pipe(rename('app.css'))
		.pipe(gulp.dest('build/'))
});

gulp.task('html',['clean', 'js', 'css-concat', 'css-version-minify'], function () {
	gulp.src('index.html')
		.pipe(htmlreplace({
			'css': 'build/app.css',
			'js': 'build/app.js'
		}))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(versionNumber(versionConfig))
		.pipe(rename('index.min.html'))
		.pipe(gulp.dest('.'));
});

gulp.task('post-clean', ['html'], function () {
	return del('build/app-concat.css');
});

gulp.task('default', ['clean', 'js', 'css-concat', 'css-version-minify', 'html', 'post-clean']);
