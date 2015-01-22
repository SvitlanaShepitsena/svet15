define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');

    var LogoDesk = require('dviews/header/LogoDesk');
    var NavDesk = require('dviews/header/NavDesk');


    function HeaderDesk() {
        this.smallSize = window.sv.sizing.headerHeight / 2.8;
        this.fullSize = window.sv.sizing.headerHeight;

        this.opacityTransitionable = new Transitionable(0);
        this.sizeTransitionable = new Transitionable(window.sv.sizing.headerHeight);
        View.apply(this, arguments);
        _init.call(this);
        _flex.call(this);
    }

    HeaderDesk.DEFAULT_OPTIONS = {};

    function _init() {
        this.backgroundMod = new Modifier({
            size: function () {
                return [undefined, this.sizeTransitionable.get()]
            }.bind(this),
            opacity: function () {
                return this.opacityTransitionable.get();
            }.bind(this)
        });
        this.backgroundSurf = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'black'
            }
        });

        this.rootNode = this.add(this.backgroundMod);
        this.rootNode.add(this.backgroundSurf);

        this.opacityTransitionable.set(0.7, {duration: 1000, curve: 'easeInOut'});
    }

    function _flex() {
        this.contentMod = new Modifier({
            size: [window.sv.sizing.contentWidth, window.sv.sizing.headerHeight],
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.layout = new FlexibleLayout({
            ratios: [2, true, 2],
            direction: 0
        });
        this.rootNode.add(this.contentMod).add(this.layout);
        this.contents = [];

        this.logoDesk = new LogoDesk();
        var leftNavDesk = new NavDesk({
            menuTitles: ['HOME', 'ABOUT US', 'DEMOGRAPHICS'],
            sizeTransitionable: this.sizeTransitionable.get(),
            size: [window.sv.sizing.navContainerWidth, undefined],
            align: [1, 0],
            origin: [1, 0]
        });
        var rightNavDesk = new NavDesk({
            menuTitles: ['CLIENTS', 'RADIO', 'CONTACT US'],
            sizeTransitionable: this.sizeTransitionable.get(),
            size: [window.sv.sizing.navContainerWidth, undefined],
            align: [0, 1],
            origin: [0, 1]
        });
        leftNavDesk.pipe(this._eventOutput);

        this.contents.push(leftNavDesk);
        this.contents.push(this.logoDesk);
        this.contents.push(rightNavDesk);

        this.layout.sequenceFrom(this.contents);

        this.rootNode.add(this.layout);

    }

    HeaderDesk.prototype = Object.create(View.prototype);
    HeaderDesk.prototype.constructor = HeaderDesk;

    HeaderDesk.prototype.increaseHeader = function () {
        var currentHeaderSize = this.sizeTransitionable.get();

        if (currentHeaderSize < this.fullSize) {
            this.sizeTransitionable.halt();

            this.sizeTransitionable.set(this.fullSize, {duration: 500, curve: "linear"});
            this.logoDesk.increaseLogo();
        }
    }

    HeaderDesk.prototype.decreaseHeader = function () {
        var currentHeaderSize = this.sizeTransitionable.get();

        if (currentHeaderSize > this.smallSize) {
            this.sizeTransitionable.halt();
            this.sizeTransitionable.set(this.smallSize, {duration: 500, curve: "linear"});
            this.logoDesk.decreaseLogo();
        }
    }


    module.exports = HeaderDesk;
});
