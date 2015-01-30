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


    function HomeDesk() {
        View.apply(this, arguments);

        this.defaultOpacity = 0.85;
        this.opacityBg = new Transitionable(this.defaultOpacity);

        _init.call(this);
        _addColorBackground.call(this);
        _fillHomeContent.call(this);
    }

    HomeDesk.prototype = Object.create(View.prototype);
    HomeDesk.prototype.constructor = HomeDesk;

    HomeDesk.DEFAULT_OPTIONS = {};

    function _init() {
        this.opacityMain = new Transitionable(1);
        this.contentTrans = new Transitionable(0);

        this.centerModifier = new Modifier({
            size: [undefined, undefined]
        });

        this.rootNode = this.add(this.rootNodeMod);

    }

    function _addColorBackground() {
        this.backdropMod = new Modifier({
            size: [undefined, true],
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.opacityBg.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });
        this.backdropSurf = new VideoSurface({
            src: 'img/sky.webm',
            autoplay: true
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
