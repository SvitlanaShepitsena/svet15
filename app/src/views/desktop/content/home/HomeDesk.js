/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsCell = require('dviews/content/home/MapsDesk');
    var Transitionable = require('famous/transitions/Transitionable');


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
        this.mapModifier = new Modifier({
            size: [undefined, undefined],
            opacity: function () {
                return 1- this.opacityMain.get();
            }.bind(this)
        });
        this.mapBackdrop = new MapsCell();
        this.mapBackdrop.pipe(this._eventOutput);

        this.beforeRootNode = this.add(this.centerModifier);
        this.beforeRootNode.add(this.mapModifier).add(this.mapBackdrop);
        this.rootNodeMod = new Modifier({
            transform: function () {
                return Transform.translate(0,this.contentTrans.get(), 0)
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
        this.opacityBg.set(0, {duration: 500}, function () {
        }.bind(this));
        this.homeContentDesk.contentShort();
    }
    HomeDesk.prototype.hideShowMap = function (opacity) {
        this.opacityMain.halt();
        this.opacityMain.set(opacity, {duration: 500});
        if (opacity === 0) {
            this.tuneToShortView();
        } else{
            this.tuneToDefaultView();

        }

    }
    HomeDesk.prototype.tuneToDefaultView = function () {
        this.opacityBg.halt();
        this.opacityBg.set(0);
        this.contentTrans.halt();
        this.contentTrans.set(0, function () {
            this.opacityBg.set(this.defaultOpacity,{duration:500}) ;
        }.bind(this));
        this.homeContentDesk.contentInit();
    }
    module.exports = HomeDesk;
});
