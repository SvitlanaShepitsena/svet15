define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var StateModifier = require('famous/modifiers/StateModifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');

    var LogoDesk = require('dviews/header/LogoDesk');
    var NavDesk = require('dviews/header/NavDesk');

    function HeaderDesk() {
        this.flexShiftInit = 30;
        this.flexShiftShort = -25;

        this.flexTransitionable = new Transitionable(30);
        this.opacityTransitionable = new Transitionable(0);
        this.heightTransitionable = new Transitionable(window.sv.sizing.headerHeight);
        this.widthTransitionable = new Transitionable(this.contentSize);
        this.navBtnContainerWidth = (window.sv.sizing.contentWidth - window.sv.sizing.logoContainerWidth) / 4;
        this.logoMargin = (window.sv.sizing.headerHeight * .6 ) / 2
        View.apply(this, arguments);
        _headerBackground.call(this);
        _flex.call(this);
    }

    HeaderDesk.prototype = Object.create(View.prototype);
    HeaderDesk.prototype.constructor = HeaderDesk;

    HeaderDesk.DEFAULT_OPTIONS = {
        smallHeight: window.sv.sizing.headerHeightSm,
        flexOpts: {
            ratios: [1, 1, 2, 1, 1],
            direction: 0
        },
        headerTransition: {
            duration: 500,
            curve: Easing.inOutQuad
        },
        backgroundOpts: {
            backgroundColor: 'black',
            opacity: 0.7,
            duration: 3000,
            curve: 'easeInOut'
        },
        navBtnOpts: {
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '1.2em'
        }

    };
    function _headerBackground() {
        this.backgroundMod = new Modifier({
            size: function () {
                return [this.widthTransitionable.get(), this.heightTransitionable.get()]
            }.bind(this),
            opacity: function () {
                return this.opacityTransitionable.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 6)
        });
        this.backgroundSurf = new Surface({
            properties: this.options.backgroundOpts
        });
        this.backgroundSurf.pipe(this._eventOutput);
        this.rootNode = this.add(this.backgroundMod);
        this.rootNode.add(this.backgroundSurf);
        this.opacityTransitionable.set(this.options.backgroundOpts.opacity, {
            duration: this.options.backgroundOpts.duration,
            curve: this.options.backgroundOpts.curve
        });
    }

    function _flex() {
        this.flexOptions = {
            ratios: this.options.flexOpts.ratios,
            direction: this.options.flexOpts.direction
        }
        this.logoDesk = new LogoDesk();
        this.logoDesk.pipe(this._eventOutput);
        this.layout = new FlexibleLayout(this.flexOptions);
        var menuItems = ['Home', 'About Us', 'Logo', 'Radio', 'Contact Us'];
        this.contents = [];
        this.surfaces = [];
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i] === 'Logo') {
                var renderNode = new RenderNode();
                var logoMod = new Modifier({
                    size: [window.sv.sizing.logoContainerWidth * .9, window.sv.sizing.headerHeight * .8],
                    transform: Transform.translate(0, 50, 0)
                });
                renderNode.add(logoMod).add(this.logoDesk);
                this.contents.push(renderNode);
                continue;
            }
            this.renderNode = new RenderNode();
            this.navBtnMod = new Modifier({
                align: [0.5, 0],
                origin: [0.5, 0],
                size: [undefined, 20],
                transform: Transform.translate(-10, 50, 0)
            });
            this.navBtnSurf = new Surface({
                content: menuItems[i],
                properties: this.options.navBtnOpts
            });

            this.navBtnSurf.pipe(this._eventOutput);
            this.surfaces.push(this.navBtnSurf);
            this.renderNode.add(this.navBtnMod).add(this.navBtnSurf);
            this.contents.push(this.renderNode);
        }

        this.surfaces.forEach(function (surface, index) {
            surface.on('click', function () {
                this._eventOutput.emit('navigateTo', {index: index});
            }.bind(this));
        }.bind(this))
        this.layout.sequenceFrom(this.contents);
        this.flexMod = new Modifier({
            transform: function () {
                return Transform.translate(0, this.flexTransitionable.get(), 0);
            }.bind(this)
        });
        this.rootNode.add(this.flexMod).add(this.layout);
    }

    HeaderDesk.prototype.increaseHeader = function () {
        this.currentHeaderHeight = this.heightTransitionable.get();

        if (this.currentHeaderHeight < window.sv.sizing.headerHeight) {
            this.flexTransitionable.halt();
            this.flexTransitionable.set(this.flexShiftInit, {duration: 500});
            this.heightTransitionable.halt();
            this.heightTransitionable.set(window.sv.sizing.headerHeight, this.options.headerTransition);
            this.logoDesk.increaseLogo();
        }
    }

    HeaderDesk.prototype.decreaseHeader = function () {
        this.currentHeaderHeight = this.heightTransitionable.get();

        if (this.currentHeaderHeight > this.options.smallHeight) {
            this.flexTransitionable.halt();
            this.flexTransitionable.set(this.flexShiftShort, {duration: 500});

            this.heightTransitionable.halt();
            this.heightTransitionable.set(this.options.smallHeight, this.options.headerTransition, function () {
                this._eventOutput.emit('header:decreased');
            }.bind(this));
            this.logoDesk.decreaseLogo();
        }
    }

    module.exports = HeaderDesk;
});
