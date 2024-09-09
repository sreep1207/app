const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const $ = require('gulp-load-plugins')();
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssInlineSvg = require('postcss-inline-svg');
const browserSync = require('browser-sync').create();
const pxtorem = require('postcss-pxtorem');
const gulpStylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

const postcssProcessors = [
  postcssInlineSvg({
    removeFill: true,
    paths: ['./node_modules/bootstrap-icons/icons'],
  }),
  pxtorem({
    propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
    mediaQuery: true,
  }),
];

const paths = {
  scss: {
    src: './scss/**/*.scss',
    dest: './css',
    watch: './scss/**/*.scss',
    bootstrap: './node_modules/bootstrap/scss/bootstrap.scss',
  },
  js: {
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    popper: './node_modules/@popperjs/core/dist/umd/popper.min.js',
    barrio: '../../contrib/bootstrap_barrio/js/barrio.js',
    dest: './js',
  },
};

// Compile sass into CSS & auto-inject into browsers
function styles() {
  return gulp.src([paths.scss.bootstrap, paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss',
        '../../contrib/bootstrap_barrio/scss',
      ],
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest));
  // .pipe(browserSync.stream())
}

function lintCssTask() {
  return gulp
    .src('./scss/**/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true },
      ],
    }));
}

function lintJsTask() {
  return gulp
    .src(['./js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Move the javascript files into our js folder
function js() {
  return gulp.src([paths.js.bootstrap, paths.js.popper, paths.js.barrio])
    .pipe(gulp.dest(paths.js.dest));
  // .pipe(browserSync.stream())
}

// Static Server + watching scss/html files
function serve() {
  gulp.watch([paths.scss.watch, paths.scss.bootstrap], styles).on('change', browserSync.reload);
}

// const build = gulp.series(styles, gulp.parallel(js, serve))
const build = gulp.series(lintCssTask, lintJsTask, styles, gulp.parallel(js));

exports.styles = styles;
exports.js = js;
exports.serve = serve;

exports.default = build;
