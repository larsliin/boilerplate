const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const concat = require('gulp-concat');
const browserSync = require("browser-sync").create();
const minify = require('gulp-minify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');


const paths = {
    styles: {
        src: ["src/scss/*.scss"],
        dest: "src/dist/css"
    },
    script: {
        src: ["src/js/*.js"],
        dest: "src/dist/js"
    }
};

function script() {
    return gulp
        .src(paths.script.src)
        .pipe(concat('scrript.js'))
        .pipe(minify())
        .pipe(gulp.dest(paths.script.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(concat('main.css'))
        // Now add/write the sourcemaps
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./src"
        }
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.script.src, script);
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    //gulp.watch("src/*.html", reload);
    gulp.watch("src/*.html").on('change', browserSync.reload);
}

// Don't forget to expose the task!
exports.watch = watch

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

exports.script = script;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, script, watch);

/*
 * You can still use `gulp.task` to expose tasks
 */

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);