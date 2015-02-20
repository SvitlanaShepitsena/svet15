define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var ScrollDesk = require('dviews/content/ScrollDesk');
    var HeaderDesk = require('dviews/header/HeaderDesk');
    var ArrowDown = require('dviews/common/ArrowDown');
    var Transitionable = require('famous/transitions/Transitionable');
    //var MapDesk = require('dviews/BgMapsDesk');

    var Transitionable = require('famous/transitions/Transitionable');

    function AppViewDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _navigation.call(this);
        _content.call(this);
        _header.call(this);
    }

    AppViewDesk.prototype = Object.create(View.prototype);
    AppViewDesk.prototype.constructor = AppViewDesk;
    AppViewDesk.DEFAULT_OPTIONS = {};

    AppViewDesk.prototype.resize = function (mainWidth) {
    }

    function _init() {

        //this.mapDesk = new MapDesk();
        //this.add(this.mapDesk);
        var limitSize = window.sv.sizing.contentWidth;

        this.contentSize = window.innerWidth > limitSize ? limitSize : window.innerWidth;
        this.widthTransitionable = new Transitionable(this.contentSize);
        this.heightTransitionable = new Transitionable(window.innerHeight);

        var centerModifier = new Modifier({
            size: function () {
                return [this.widthTransitionable.get(), this.heightTransitionable.get()]
            }.bind(this),
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.rootNode = this.add(centerModifier);
        window.onresize = function () {
            this.contentSize = window.innerWidth > limitSize ? limitSize : window.innerWidth;
            this.widthTransitionable.halt();
            this.widthTransitionable.set(this.contentSize, {duration: 300, curve: "easeInOut"});
            this.heightTransitionable.halt();
            this.heightTransitionable.set(window.innerHeight, {duration: 300, curve: "easeInOut"});
        }.bind(this)

        _arrows.call(this);
    }

    function _arrows() {

        var initialAngle = 120 * Math.PI / 180;
        this.arrowAngle = new Transitionable(initialAngle);
        this.arrowOpacity = new Transitionable(0);


        this.arrowDownMod = new Modifier({
            size: [45, 33],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: function () {
                return Transform.multiply4x4(Transform.translate(0, window.innerHeight - 50, 2), Transform.rotateX(this.arrowAngle.get()));
            }.bind(this)
        });

        this.arrowDown = new ArrowDown();

        this.rootNode.add(this.arrowDownMod).add(this.arrowDown);
        this.arrowAngle.set(0, {duration: 1000});
    }


    function _header() {
        this.headerDesk = new HeaderDesk();

        this.headerDesk.on('navigateTo', function (data) {
            //if (data.index === 0) {
            //    this.scrolldesk.tuneToDefaultHeader();
            //    this.scrolldesk.goToPage(0);
            //    this.scrolldesk.scrollview.setPosition(0);
            //
            //} else
            this.scrolldesk.goToPage.call(this.scrolldesk, data.index);
        }.bind(this))
        this.rootNode.add(this.headerDesk);

        this.scrolldesk.subscribe(this.headerDesk);
    }

    function _content() {
        this.scrolldesk = new ScrollDesk({ctx: this.options.ctx});

        this.scrolldesk.on('decrease:header', function () {
            this.headerDesk.decreaseHeader.call(this.headerDesk);
        }.bind(this));

        this.scrolldesk.on('increase:header', function () {
            this.headerDesk.increaseHeader.call(this.headerDesk);
            //
        }.bind(this));

        this.rootNode.add(this.scrolldesk);
    }

    function _navigation() {

    }


    module.exports = AppViewDesk;
});
