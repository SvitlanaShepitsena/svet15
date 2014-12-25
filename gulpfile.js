'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path');
var _ = require('underscore');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var rename = require("gulp-rename");
var rjs = require('gulp-requirejs');

var filter = require('gulp-filter');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');

var open = require("gulp-open");
var cssmin = require('gulp-cssmin');
var logger = require('express-logger');

var EXPRESS_PORT = 3001;
var EXPRESS_ROOT = __dirname;

function startExpress() {
    var express = require('express');
    var app = express();

    app.set('port', process.env.PORT || 3001);
    app.engine('jade', require('jade').__express);
    app.set('view engine', 'jade');
    //app.set('views', 'jade');

    app.use(express.static(path.join(__dirname, './app')));
    app.set('views', path.join(__dirname, './app'));

    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/about', function (req, res) {
        res.render('about');
    });
    app.get('/demographics', function (req, res) {
        res.render('demographics');
    });

    app.listen(EXPRESS_PORT);
}

gulp.task('css', function () {
    gulp.src('app/styles/main.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/styles'));
});

gulp.task('nib', function () {
    gulp.src('app/styles/nib.styl')
        .pipe(stylus({use: [nib()]}))
        .pipe(gulp.dest('app/styles/nib'));
});

gulp.task('stylus', function () {

    var onError = function (err) {
        notify.onError({
            title: "Gulp",
            subtitle: "Failure!",
            message: "Error: <%= error.message %>",
            sound: "Beep"
        })(err);
        this.emit('end');
    };

    gulp.src('app/styles/**/*.styl')
        .pipe(plumber({errorHandler: onError}))
        .pipe(stylus({
            use: [nib()],
            compress: true
        }))
        .pipe(gulp.dest('app/styles/'))
        .pipe(filter('**/*.css'))
});

var onError = function (err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);
    this.emit('end');
};
gulp.task('jade', function () {

    gulp.src('app/*.jade')
        //compiler does not stop on error
        .pipe(plumber({errorHandler: onError}))
        .pipe(jade({
            compileDebug: false
        }))
        .pipe(gulp.dest('app/views/'))
        .pipe(reload({stream: true}))
});

gulp.task('js', function () {
    gulp.src('app/src/**/*.js')
        .pipe(plumber({errorHandler: onError}))
    rjs({
        baseUrl: './app/src',
        out: 'app.js',
        paths: {
            famous: "../lib/famous/src",
            requirejs: "../lib/requirejs/require",
            views: "../views",
            almond: "../lib/almond/almond"
        },
        include: ['main', 'about', 'demographics'],
        findNestedDependencies: true,
        skipPragmas: true,
        create: true

    })
        .pipe(gulp.dest('app/dist'))
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

gulp.task('default', ['jade','js'], function () {
    gulp.watch('app/**/*.js', function () {
        rjs({
            baseUrl: './app/src',
            out: 'app.js',
            paths: {
                famous: "../lib/famous/src",
                requirejs: "../lib/requirejs/require",
                views: "../views",
                almond: "../lib/almond/almond"
            },
            include: ['main', 'about', 'demographics'],
            findNestedDependencies: true,
            skipPragmas: true,
            create: true

        })
            .pipe(gulp.dest('app/dist'))
            .pipe(reload({stream: true}));
    });

    gulp.src('app/*.jade')
        .pipe(watch('app/*.jade'))
        .pipe(jade())
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulp.dest('./app'))
        .pipe(reload({stream: true}));

    gulp.run('browser-sync');

});

