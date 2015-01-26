/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsDesk = require('dviews/content/home/MapsDesk');
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    function HomeDesk() {
        View.apply(this, arguments);
        this.defaultOpacity = 0.85;
        this.opacityBg = new Transitionable(this.defaultOpacity);

        _init.call(this);
        _addColorBackground.call(this);
        _fillHomeContent.call(this);
        _shortViewIcons.call(this);
    }

    function _shortViewIcons() {
        this.gridIconTrans = new Transitionable(0);

        this.gridIconsMod = new Modifier({
            size: [200, 200],
            align: [1, 0.5],
            origin: [1, 1],
            opacity: function () {
                return this.gridIconTrans.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 1)
        });
        this.gridLayout = new GridLayout({
            dimensions: [2, 2]
        });

        this.surfaces = [];
        this.gridLayout.sequenceFrom(this.surfaces);

        var iconRoot = 'img/home-page/icons-color/';
        this.dailyNewsIcon = new ImageSurface({
            size: [50, 50],
            properties:{
                cursor:'pointer'
            },
            content: iconRoot + 'news-daily.png'

        });


        this.weeklyNewsIcon = new ImageSurface({
            size: [50, 50],
            properties:{
                cursor:'pointer'
            },
            content: iconRoot + 'weekly.png'
        });
        this.ypIcon = new ImageSurface({
            size: [50, 50],
            properties:{
                cursor:'pointer'
            },
            content: iconRoot + 'yp.png'
        });
        this.radioIcon = new ImageSurface({
            size: [50, 50],
            properties:{
                cursor:'pointer'
            },
            content: iconRoot + 'radio.png'
        });

        this.dailyNewsIcon.on('click', function () {
            this.map.showSvetPoints();
        }.bind(this))

        this.weeklyNewsIcon.on('click', function () {
            this.map.showSvetPoints();
        }.bind(this))

        this.ypIcon.on('click', function () {
            this.map.showYpCompanies();
        }.bind(this))

        this.surfaces.push(this.dailyNewsIcon);
        this.surfaces.push(this.weeklyNewsIcon);
        this.surfaces.push(this.ypIcon);
        this.surfaces.push(this.radioIcon);
        this.rootNode.add(this.gridIconsMod).add(this.gridLayout);


    }

    HomeDesk.prototype = Object.create(View.prototype);
    HomeDesk.prototype.constructor = HomeDesk;

    HomeDesk.DEFAULT_OPTIONS = {};

    function _init() {
        this.mapLayerTranf = new Transitionable(0);
        this.opacityMain = new Transitionable(1);
        this.contentTrans = new Transitionable(0);

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight]
        });
        this.mapModifier = new Modifier({
            size: [undefined, undefined],
            opacity: function () {
                return 1 - this.opacityMain.get();
            }.bind(this),
            transform: function () {
                return Transform.translate(0, 0, this.mapLayerTranf.get());
            }.bind(this)
        });
        this.map = new MapsDesk();
        this.map.pipe(this._eventOutput);

        this.beforeRootNode = this.add(this.centerModifier);
        this.beforeRootNode.add(this.mapModifier).add(this.map);
        this.rootNodeMod = new Modifier({
            transform: function () {
                return Transform.translate(0, this.contentTrans.get(), 0)
            }.bind(this)
        });
        this.rootNode = this.beforeRootNode.add(this.rootNodeMod);

    }

    function _addColorBackground() {
        this.backdropMod = new Modifier({
            opacity: function () {
                return this.opacityBg.get();
            }.bind(this),
            size: [undefined, undefined],
            transform: Transform.translate(0, 0, 0)
        });
        this.backdropSurf = new Surface({
            properties: {
                textAlign: 'center',
                backgroundColor: '#3D566E'
            }
        });
        this.backdropSurf.pipe(this._eventOutput);
        this.rootNode.add(this.backdropMod).add(this.backdropSurf);
    }

    function _fillHomeContent() {
        this.contentMod = new Modifier({
            align: [0, 0],
            origin: [0, 0],
            opacity: function () {
                return this.opacityMain.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });
        this.homeContentDesk = new HomeContentDesk();
        this.homeContentDesk.pipe(this._eventOutput);
        this.rootNode.add(this.contentMod).add(this.homeContentDesk);
    }

    HomeDesk.prototype.tuneToShortView = function () {
        this.opacityBg.halt();
        this.gridIconTrans.halt();
        this.gridIconTrans.set(1, {duration: 500});
        this.opacityBg.set(0, {duration: 500}, function () {
        }.bind(this));
        this.homeContentDesk.contentShort();
    }
    HomeDesk.prototype.hideShowMap = function (opacity) {
        this.opacityMain.halt();
        this.opacityMain.set(opacity, {duration: 500});
        if (opacity === 0) {
            this.tuneToShortView();
        } else {
            this.tuneToDefaultView();

        }

    }
    HomeDesk.prototype.tuneToDefaultView = function () {
        this.opacityBg.halt();
        this.opacityBg.set(0);


        this.gridIconTrans.halt();
        this.gridIconTrans.set(0, {duration: 500});

        this.contentTrans.halt();
        this.contentTrans.set(0, function () {
            this.opacityBg.set(this.defaultOpacity, {duration: 500});
        }.bind(this));
        this.homeContentDesk.contentInit();
    }
    module.exports = HomeDesk;
});
