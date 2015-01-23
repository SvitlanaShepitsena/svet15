define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var StateModifier = require('famous/modifiers/StateModifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');

    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');

    var LogoDesk = require('dviews/header/LogoDesk');
    var NavDesk = require('dviews/header/NavDesk');

    function HeaderDesk() {
        this.opacityTransitionable = new Transitionable(0);
        this.sizeTransitionable = new Transitionable(window.sv.sizing.headerHeight);

        View.apply(this, arguments);
        _headerBackground.call(this);
        _flex.call(this);
    }

    HeaderDesk.prototype = Object.create(View.prototype);
    HeaderDesk.prototype.constructor = HeaderDesk;

    HeaderDesk.DEFAULT_OPTIONS = {
        smallHeight: window.sv.sizing.headerHeight / 2.8,
        flexOpts: {
            ratios: [2, true, 2],
            direction: 0
        },
        backgroundOpts: {
            backgroundColor: 'black',
            opacity: 0.7,
            duration: 3000,
            curve: 'easeInOut'
        }
    };
    function _headerBackground() {
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
            properties: this.options.backgroundOpts
        });
        this.rootNode = this.add(this.backgroundMod);
        this.rootNode.add(this.backgroundSurf);
        this.opacityTransitionable.set(this.options.backgroundOpts.opacity, {
            duration: this.options.backgroundOpts.duration,
            curve: this.options.backgroundOpts.curve
        });
    }

    function _flex() {
        this.layout = new FlexibleLayout({
            ratios: this.options.flexOpts.ratios,
            direction: this.options.flexOpts.direction
        });
        this.rootNode.add(this.layout);
        this.contents = [];

        this.logoDesk = new LogoDesk();

        this.leftNavDesk = new NavDesk({
            navTitles: ['HOME', 'ABOUT US', 'DEMOGRAPHICS'],
            align: [1, 0],
            origin: [1, 0]
        });
        this.rightNavDesk = new NavDesk({
            navTitles: ['CLIENTS', 'RADIO', 'CONTACT US'],
            align: [0, 1],
            origin: [0, 1]
        });

        this.leftNavDesk.pipe(this._eventOutput);
        this.rightNavDesk.pipe(this._eventOutput);

        this.contents.push(this.leftNavDesk);
        this.contents.push(this.logoDesk);
        this.contents.push(this.rightNavDesk);

        this.layout.sequenceFrom(this.contents);
        this.rootNode.add(this.layout);
    }

    HeaderDesk.prototype.increaseHeader = function () {
        this.currentHeaderHeight = this.sizeTransitionable.get();

        if (this.currentHeaderHeight <window.sv.sizing.headerHeight) {
            this.sizeTransitionable.halt();
            this.sizeTransitionable.set(window.sv.sizing.headerHeight, {duration: 500, curve: "linear"});
            this.logoDesk.increaseLogo();
        }
    }

    HeaderDesk.prototype.decreaseHeader = function () {
        this.currentHeaderHeight = this.sizeTransitionable.get();

        if (this.currentHeaderHeight > this.options.smallHeight) {
            this.sizeTransitionable.halt();
            this.sizeTransitionable.set(this.options.smallHeight, {duration: 500, curve: "linear"}, function () {
                this._eventOutput.emit('header:decreased');
            }.bind(this));
            this.logoDesk.decreaseLogo();
        }
    }

    module.exports = HeaderDesk;
});
