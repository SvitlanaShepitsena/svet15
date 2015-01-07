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
    changed = require('gulp-changed'),
    newer = require('gulp-newer'),
    rupture = require("rupture"),
    gutil = require('gulp-util'),
    notify = require("gulp-notify"),
    htmlreplace = require('gulp-html-replace'),
    uncss = require('gulp-uncss'),
    glob = require('glob'),
    shell = require('gulp-shell'),
    processhtml = require('gulp-processhtml');

var dev = 'app/build/',
    app = 'app/',
    temp = '.tmp/',
    dist = 'app/dist/';

var currentView = app;

var onError = function (err) {

    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);
    this.emit('end');
};

function startExpress() {
    var express = require('express');
    var app = express();

    app.set('port', process.env.PORT || 3001);
    app.engine('jade', require('jade').__express);
    app.set('views', currentView);
    app.use(express.static(path.join(__dirname, currentView)));

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.listen(3001);
}

gulp.task('img', function () {
    var DEST = dev + 'img';
    return gulp.src('app/img/**/*')
        .pipe(changed(DEST))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('moveUp', function () {
    return gulp.src(dev + 'index.html')
        .pipe(gulp.dest("app"));
});

gulp.task('copyAssets', function () {

    return gulp.src("app/index.html")
        .pipe(assets({
            js: false,
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
            use: [nib(), jeet(), rupture()],
            compress: false
        }))
        .pipe(gulp.dest(temp + 'styles/'))
        .pipe(reload({stream: true}));
});

gulp.task('autoprefix', ['stylus'], function () {
    return gulp.src(temp + '/styles/*.css')
        .pipe(prefix())
        .pipe(gulp.dest(app + 'styles'))
        .pipe(reload({stream: true}));
});

gulp.task('add', function () {
    return gulp.src('app/*')
        .pipe(git.add());
});


gulp.task('commit', shell.task([
    'git commit -m "Deploy tp Heroku"',
]))

gulp.task('jade', function () {
    return gulp.src('app/*.jade')
        .pipe(plumber({errorHandler: onError}))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(app))
        .pipe(reload({stream: true}))
});
gulp.task('jade:d', function () {
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
            pretty: false
        }))
        .pipe(gulp.dest('app/jade'))
        .pipe(reload({stream: true}))
});

gulp.task('copy:reset', function () {
    return gulp.src(['app/styles/reset.css'], {base: 'app'})
        .pipe(newer(dev))
        .pipe(gulp.dest(dev))
});

gulp.task('js', function () {
    var DEST = dev + 'js';
    return gulp.src(['app/src/main.js'])
        .pipe(rjs(
            {
                baseUrl: './app/src',
                out: 'app.js',
                paths: {
                    famous: "../lib/famous/src",
                    requirejs: "../lib/requirejs/require",
                    views: "views",
                    dviews: "views/desktop",
                    jade: "../jade",
                    almond: "../lib/almond/almond"
                },
                name: 'main',
                include: ['main'],
                create: true
            }))
        .pipe(uglify({mangle: true}))
        //.pipe(concat('app.js'))
        .pipe(gulp.dest(DEST))
        .pipe(reload({stream: true}));
});

gulp.task('assets:dist', function () {
    gulp.src(['app/build/js/*.js'])
        .pipe(uglify('app.js', {outSourceMap: false, mangle: false}))
        .pipe(gulp.dest(dist + 'js'));

    gulp.src('app/build/**/*.css')
        .pipe(concatCss("app.css"))
        .pipe(cssmin({keepSpecialComments: 0}))
        .pipe(gulp.dest(dist + 'styles/'));

    gulp.src(dev + 'img/**/*', {base: dev}).pipe(gulp.dest(dist));

    return gulp.src(app + 'lib/requirejs/**/*.js', {base: app})
        .pipe(uglify({outSourceMap: false, mangle: true}))
        .pipe(gulp.dest(dist));
});

gulp.task('index:dist', function () {
    return gulp.src(dev + 'index.html')
        .pipe(htmlreplace({
            'css': 'styles/app.css',
            'remove': '',
            'require': '<script type=text/javascript src=lib/requirejs/require.js data-main=js/app.js></script>'
        }))
        .pipe(minifyHTML())
        .pipe(gulp.dest(dist))
});

gulp.task('nodemon', function () {
    startExpress();
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('browser-sync', function () {
    //browserSync({
    //    proxy: "localhost:3001",
    //    notify: false
    //});
    browserSync({
        server: {
            baseDir: './app'
        },
        notify: false
    });
});

gulp.task('default', ['jade:v', 'jade', 'autoprefix'], function () {
    //runSequence('js', 'add');

    gulp.watch(['app/src/*.js', 'app/src/views/**/*.js'], ['reload']);
    gulp.watch('app/img/**/*', ['img']);
    gulp.watch('app/*.jade', ['jade']);
    gulp.watch('app/jade/*.jade', ['jade:v']);
    gulp.watch('app/styles/**/*.styl', ['autoprefix']);

    //browserSync();
    gulp.start('browser-sync');

});

gulp.task('clean', function () {
    gulp.src(dist, {read: false})
        .pipe(clean());

    return gulp.src(dev, {read: false})
        .pipe(clean());
});

gulp.task('heroku', shell.task([
    'git push heroku master',
]))

gulp.task('glob', function () {
    return gulp.src(dist + 'styles/app.css')
        .pipe(uncss({
            html: glob.sync('app/jade/*.html')
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(dist + 'styles/'));
});
gulp.task('famo:glob', ['glob'], function () {
    return gulp.src(['app/lib/famous/dist/*.css', dist + 'styles/app.css'])
        .pipe(concatCss("app.css"))
        .pipe(cssmin())
        .pipe(gulp.dest(dist + 'styles/'));
});

gulp.task('her', function () {
    runSequence('clean', 'jade:d', 'jade:v', 'copyAssets', 'img', 'js', 'autoprefix', 'copy:reset', 'assets:dist', 'index:dist', 'famo:glob', 'add', 'commit', 'heroku');
});


