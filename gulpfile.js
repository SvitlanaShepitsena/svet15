'use strict';

var express = require('express'),
    uglify = require('gulp-uglifyjs'),
    bodyParser = require('body-parser'),
    jeet = require('jeet'),
    path = require('path'),
    _ = require('underscore'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    rename = require("gulp-rename"),
    rjs = require('gulp-requirejs'),
    filter = require('gulp-filter'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    prefix = require('gulp-autoprefixer'),
    open = require("gulp-open"),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    pngquant = require('imagemin-pngquant'),
    runSequence = require('run-sequence'),
    git = require('gulp-git'),
    rimraf = require('gulp-rimraf'),
    concatCss = require('gulp-concat-css'),
    assets = require("gulp-assets"),
    minifyHTML = require("gulp-minify-html"),
    processhtml = require('gulp-processhtml');

var dev = 'app/build/',
    dist = 'app/dist/';

var onError = function (err) {
    gutil.beep();
    console.log(err);
};

function startExpress() {
    var express = require('express');
    var app = express();

    app.set('port', process.env.PORT || 3001);
    app.engine('jade', require('jade').__express);
    app.set('views', dev);
    app.use(express.static(path.join(__dirname, dev)));

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.listen(3001);
}

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dev + 'img'));
});

gulp.task('moveUp', function () {
    return gulp.src(dev + 'index.html')
        .pipe(gulp.dest("app"));
});

gulp.task('copyAssets', function () {

    return gulp.src("app/index.html")
        .pipe(assets({
            js: true,
            css: true
        }))
        .pipe(gulp.dest(dev));
});
gulp.task('delIndex', function () {

    return gulp.src("app/index.html")
        .pipe(rimraf());
});

gulp.task('stylus', function () {
    return gulp.src('app/styles/**/*.styl')
        .pipe(plumber({errorHandler: onError}))
        .pipe(stylus({
            use: [nib(), jeet()],
            compress: true
        }))
        .pipe(gulp.dest('app/styles/'))
        .pipe(reload({stream: true}));
});

gulp.task('autoprefix', ['stylus'], function () {
    return gulp.src('app/styles/*.css')
        .pipe(prefix())
        .pipe(gulp.dest(dev + 'styles'))
        .pipe(reload({stream: true}));
});

gulp.task('add', function () {
    return gulp.src('app')
        .pipe(git.add());
});

gulp.task('jade', function () {
    return gulp.src('app/*.jade')
        .pipe(plumber({errorHandler: onError}))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(dev))
        .pipe(reload({stream: true}))
});

gulp.task('jade:v', function () {
    return gulp.src('app/jade/*.jade')
        .pipe(plumber({errorHandler: onError}))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('app/jade'))
        .pipe(reload({stream: true}))
});

gulp.task('js', function () {
    gulp.src(['app/src/*.js', 'app/lib/*.js'])
        .pipe(rjs(
            {
                baseUrl: './app/src',
                out: 'app.js',
                paths: {
                    famous: "../lib/famous/src",
                    requirejs: "../lib/requirejs/require",
                    views: "../views",
                    jade: "../jade",
                    almond: "../lib/almond/almond"
                },
                name: 'main',
                include: ['main'],
                create: true
            }))
        //.pipe(uglify({mangle: true}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(dev + 'js'))
        .pipe(reload({stream: true}));
});

gulp.task('assets:dist', function () {
    gulp.src(['app/build/**/*.js', '!app/build/lib/requirejs/**'])
        .pipe(uglify('app.js', {outSourceMap: false}))
        .pipe(gulp.dest(dist + 'js'));

    gulp.src(dev + '/**/*.css')
        .pipe(concatCss("app.css"))
        .pipe(cssmin())
        .pipe(gulp.dest(dist + 'styles/'));

    gulp.src(dev + 'img/**/*', {base: dev}).pipe(gulp.dest(dist));

    gulp.src(dev + 'lib/requirejs/**/*', {base: dev})
        .pipe(uglify({outSourceMap: false, mangle: false}))
        .pipe(gulp.dest(dist));
});

gulp.task('index:dist', function () {
    gulp.src(dev + 'index.html')
        .pipe(processhtml())
        .pipe(minifyHTML())
        .pipe(gulp.dest(dist));
});

gulp.task('nodemon', function () {
    startExpress();
});

gulp.task('browser-sync', ['nodemon'], function () {
    browserSync({
        proxy: "localhost:3001",
        notify: false
    });
});

gulp.task('default', ['jade:v', 'jade', 'autoprefix'], function () {
    gulp.run('js');
    gulp.watch(['app/src/*.js', 'app/views/*.js'], ['js']);
    gulp.watch('app/img/**/*', ['img']);
    gulp.watch('app/*.jade', ['jade']);
    gulp.watch('app/jade/*.jade', function () {
       runSequence('jade:v','js') ;
    })
    gulp.watch('app/styles/**/*.styl', ['autoprefix']);

    gulp.start('browser-sync');

});

gulp.task('clean', function () {
    return gulp.src(dev, {read: false})
        .pipe(clean());
});

gulp.task('deploy', function () {
    runSequence('clean', 'jade', ['js', 'img'], 'moveUp', 'copyAssets', 'delIndex', 'autoprefix', 'add', 'assets:dist', 'index:dist');
});


