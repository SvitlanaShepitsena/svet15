define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var LogoView = require('dviews/header/LogoView');
    var NavView = require('dviews/header/NavView');

    HeaderView.DEFAULT_OPTIONS = {};

    function HeaderView() {
        View.apply(this, arguments);
        _init.call(this);
        _backGround.call(this);
        _flex.call(this);
    }

    function _init() {

        this.opacityTransitionable = new Transitionable(0);

        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityTransitionable.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
        this.opacityTransitionable.set(1, {duration:1000,  curve : 'easeInOut'});
    }


    function _backGround() {

        this.bgMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: new Transitionable(0.5),
            transform: Transform.translate(0, 0, 0)
        });
        this.backGround = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'grey'
            }
        });
        this.rootNode.add(this.bgMod).add(this.backGround);

    }


    function _flex() {
        this.layout = new FlexibleLayout({
            ratios: [1, 5],
            direction: 0
        });
        this.rootNode.add(this.layout);

        this.contents = [];


        var logoView = new LogoView();
        var navView = new NavView();

        this.contents.push(logoView);
        this.contents.push(navView);

        this.layout.sequenceFrom(this.contents);

        this.add(this.layout);

    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;


    module.exports = HeaderView;
});
