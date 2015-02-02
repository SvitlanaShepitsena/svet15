/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");

    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsDesk = require('dviews/content/home/MapsDesk');
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Slider = require('famous/widgets/Slider');
    var VideoSurface = require('famous/surfaces/VideoSurface');

    var RenderNode = require('famous/core/RenderNode');
    var MapDesk = require('dviews/content/home/MapsDesk');


    function HomeDesk() {
        View.apply(this, arguments);

        this.defaultOpacity = 0.85;
        this.opacityBg = new Transitionable(this.defaultOpacity);

        _init.call(this);
        _addVideoBg.call(this);
        _fillHomeContent.call(this);
        _map.call(this);
        //_shortViewIcons.call(this);
    }

    function _map() {
        this.modMap = new Modifier({
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 680, 0)
        });

        this.mapDesk = new MapDesk({sync: this.options.sync});

        this.mapDesk.pipe(this._eventOutput);
        this.rootNode.add(this.modMap).add(this.mapDesk);

    }

    HomeDesk.prototype = Object.create(View.prototype);
    HomeDesk.prototype.constructor = HomeDesk;

    HomeDesk.DEFAULT_OPTIONS = {
        mapIconProps: {
            backroundColor: window.sv.scheme.sectionColor,
            cursor: 'pointer'
        }
    };

    function _init() {
        this.opacityMain = new Transitionable(1);
        this.contentTrans = new Transitionable(0);

        this.centerModifier = new Modifier({});

        this.rootNode = this.add(this.rootNodeMod);
    }


    function _addVideoBg() {
        this.backdropMod = new Modifier({
            size: [window.sv.sizing.contentWidth * 1.014, true],
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.opacityBg.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });
        this.backdropSurf = new VideoSurface({
            //src: 'img/sky.webm',
            src: 'img/chicago-sunset.mp4',
            autoplay: true
        });
        this.backdropSurf.pipe(this._eventOutput);
        this.rootNode.add(this.backdropMod).add(this.backdropSurf);
    }

    function _fillHomeContent() {
        this.contentMod = new Modifier({
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
        this.homeContentDesk.contentShort1();
    }

    HomeDesk.prototype.tuneToDefaultView = function () {
        this.homeContentDesk.contentInit1();
    }
    HomeDesk.prototype.tuneToShortMoto2 = function () {
        this.homeContentDesk.contentShort2();
    }

    HomeDesk.prototype.tuneToDefaultMoto2 = function () {
        this.homeContentDesk.contentInit2();
    }
    HomeDesk.prototype.showMapIcons = function () {
        this.mapDesk.showMapIcons();
    }
    module.exports = HomeDesk;
});
