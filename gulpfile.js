/* eslint-env node */

'use strict'

/******************************************************************************
 * DEPENDENCIED
 *****************************************************************************/

var gulp = require('gulp')
var bg = require('gulp-bg')
//var harmonize = require('harmonize')

var runSequence = require('run-sequence') // run gulp tasks in sequence
var rimraf = require('rimraf') // like rm -rf
var rename = require('gulp-rename')

var _if = require('gulp-if')

var yargs = require('yargs')


/******************************************************************************
 * SETTINGS, CALLBACKS, VARS
 *****************************************************************************/

//
// Programatically run node cmd with --harmonize flag
// (Node will be compatible with ES6 Harmony)
//harmonize() // - not work with node 5.4.0

var args = yargs
    .alias('p', 'production')
    .argv


var lr

function startLivereload() {
    lr = require('tiny-lr')()
    lr.listen(35729)
}

function notifyLivereload(event) {
    var fileName = require('path').relative(__dirname, event.path)
    lr.changed({body: {files: [fileName]}})
}

function runTaskAndNotifyLR(task, event) {
    gulp.start(task, function() {
        notifyLivereload(event)
    })
}

/******************************************************************************
 * LIVE RELOAD TASKS
 *****************************************************************************/

gulp.task('livereload', function() {
    startLivereload()
})

gulp.task('watch', function() {
    lr.listen()
    gulp.watch('src/**/*', function(event) {
        runTaskAndNotifyLR('scripts', event)
    })
    gulp.watch('assets/css/**/*.scss', function(event) {
        runTaskAndNotifyLR('styles', event)
    })
})


/******************************************************************************
 * BUILD TASKS
 *****************************************************************************/

gulp.task('scripts', function(e) {

    var browserify = require('browserify')
    var babelify = require('babelify') // ES6 transpiler
    var source = require('vinyl-source-stream')
    var buffer = require('vinyl-buffer')
    var strictify = require('strictify')
    var uglify = require('gulp-uglifyjs')

    //todo specify browserify shim paths in some config
    return browserify({
        entries: './src/client/main.js',
        extensions: ['.jsx'],
        debug: true,
        shim: {
            'leaflet': {
                path: 'node_modules/leaflet/dist/leaflet.js',
                exports: 'global:L',
            },
            'leaflet-control-geocoder': {
                path: 'node_modules/leaflet-control-geocoder/Control.Geocoder.js',
            },
            'leaflet-routing-machine': {
                path: 'node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js',
            },
        },
    })
        .transform(babelify.configure({
                optional: [
                    "es7.asyncFunctions",
                    "es7.classProperties",
                    "es7.comprehensions",
                    "es7.decorators",
                    "es7.doExpressions",
                    "es7.exponentiationOperator",
                    "es7.exportExtensions",
                    "es7.functionBind",
                    "es7.objectRestSpread",
                    "es7.trailingFunctionCommas"
                ]
            }
        ))
        .bundle()
        .pipe(strictify())
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(_if(args.production, uglify())) // TODO mangle, compress?
        .pipe(gulp.dest('build'))
})

gulp.task('styles', function() {

    var sass = require('gulp-ruby-sass')
    var autoprefixer = require('gulp-autoprefixer')
    var cssImport = require('gulp-cssimport')
    var minifycss = require('gulp-minify-css')
    return sass('assets/css/base.scss', {
        'sourcemap=none': true,
        precision: 10,
        style: 'expanded',
    })
        .pipe(cssImport())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(_if(args.production, minifycss()))
        .pipe(rename('app.css'))
        .pipe(gulp.dest('./build/css'))
})

gulp.task('images', function() {

    var imagemin = require('gulp-imagemin')
    var pngquant = require('imagemin-pngquant')
    var gifsicle = require('imagemin-gifsicle')
    //todo specify path to dependency image src or use our own images
    return gulp.src(['assets/img/*',
            'node_modules/leaflet/dist/images/*',
            'node_modules/leaflet-control-geocoder/images/*',
            'node_modules/leaflet-routing-machine/dist/*.png',
        ])
        // .pipe(imagemin({
        //  progressive: true,
        //  svgoPlugins: [{removeViewBox: false}],
        //  use: [pngquant(), gifsicle({interlaced: true})],
        // }))
        .pipe(gulp.dest('build/images'))
})

gulp.task('fonts', function() {
    return gulp.src([
            'node_modules/bootstrap/dist/fonts/*',
        ])
        .pipe(gulp.dest('build/fonts'))
})

gulp.task('build', ['scripts', 'images', 'styles', 'fonts'])

/******************************************************************************
 * CODE CHECKING AND TESTING TASKS
 *****************************************************************************/

gulp.task('eslint', function() {
    var eslint = require('gulp-eslint')

    return gulp.src([
            'gulpfile.js',
            'src/**/*.{js,jsx}',
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
})

// TODO: if slow, run on compiled assets.
gulp.task('jest', function(done) {
    var jest = require('jest-cli')

    var rootDir = './src'
    jest.runCLI({
        config: {
            'rootDir': rootDir,
            'scriptPreprocessor': '../node_modules/babel-jest',
            'testFileExtensions': ['es6', 'js'],
            'moduleFileExtensions': ['js', 'json', 'es6'],
        },
    }, rootDir, function(success) {
        /* eslint no-process-exit:0 */
        done(success ? null : 'jest failed')
        process.on('exit', function() {
            process.exit(success ? 0 : 1)
        })
    })
})

/******************************************************************************
 * OTHER TASKS
******************************************************************************/

gulp.task('env', function() {
    process.env.NODE_ENV = args.production ? 'production' : 'development'
})


gulp.task('clean', function(cb) {
    rimraf('./build', cb)
})

/******************************************************************************
 * SERVER TASKS
 *****************************************************************************/

gulp.task('server', bg('node', 'src/server'))

gulp.task('test', ['eslint', 'jest'])

gulp.task('default', function(cb) {
    runSequence('clean', ['env', 'build'], ['server', 'livereload'], 'watch', cb)
})