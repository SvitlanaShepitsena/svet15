define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    /*App Require*/
    var ScrollDesk = require('dviews/content/ScrollDesk');
    var HeaderDesk = require('dviews/header/HeaderDesk');
    var ArrowDown = require('dviews/common/ArrowDown');
    var ArrowUp = require('dviews/common/ArrowUp');

    AppViewDesk.prototype = Object.create(View.prototype);
    AppViewDesk.prototype.constructor = AppViewDesk;
    AppViewDesk.DEFAULT_OPTIONS = {};

    function AppViewDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _navigation.call(this);
        _content.call(this);
        _header.call(this);
    }


    AppViewDesk.prototype.resize = function (mainWidth) {
    }

    function _init() {
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

        _downArrow.call(this);
    }

    function _downArrow() {

        var h = window.innerHeight;
        var dif = (h - 768) / 100;
        this.velocityStep = dif;

        this.initialDownAngle = 120 * Math.PI / 180;
        this.arrowDownAngleTrans = new Transitionable(this.initialDownAngle);
        this.arrowDownOpacity = new Transitionable(0);


        this.arrowDownMod = new Modifier({
            size: [45, 33],
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.arrowDownOpacity.get();
            }.bind(this),
            transform: function () {
                return Transform.multiply4x4(Transform.translate(0, window.innerHeight - 50, 2), Transform.rotateX(this.arrowDownAngleTrans.get()));
            }.bind(this)
        });
        this.arrowDownOpacity.set(1, {duration: 1000});
        this.arrowDown = new ArrowDown();

        this.arrowDown.on('mousedown', function () {
            this.scrolldesk.scroll(this.velocityStep * -1);

        }.bind(this));
        this.on('scroll:up', function () {
            this.scrolldesk.scroll(this.velocityStep);

        })

        this.rootNode.add(this.arrowDownMod).add(this.arrowDown);
        this.arrowDownAngleTrans.set(0, {duration: 1000});
    }


    function _header() {
        this.headerDesk = new HeaderDesk();

        this.headerDesk.on('navigateTo', function (data) {
            this.scrolldesk.goToPage.call(this.scrolldesk, data.index);
        }.bind(this))
        this.rootNode.add(this.headerDesk);

        this.scrolldesk.subscribe(this.headerDesk);
        this.headerDesk.pipe(this._eventOutput);

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

        this.scrolldesk.on('hide:downArrow', function () {
            this.arrowDownOpacity.halt();
            this.arrowDownOpacity.set(0, {duration: 1000});
            this.arrowDownAngleTrans.halt()
            this.arrowDownAngleTrans.set(this.initialDownAngle, {duration: 1000});
            //
        }.bind(this));

        this.scrolldesk.on('show:downArrow', function () {
            this.arrowDownOpacity.halt();
            this.arrowDownAngleTrans.halt()
            this.arrowDownOpacity.set(1, {duration: 1000});
            this.arrowDownAngleTrans.set(0, {duration: 1000});
            //
        }.bind(this));


        this.rootNode.add(this.scrolldesk);
    }

    function _navigation() {

    }


    module.exports = AppViewDesk;
});
