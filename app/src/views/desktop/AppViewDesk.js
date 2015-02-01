define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var ScrollDesk = require('dviews/content/ScrollDesk');
    var HeaderDesk = require('dviews/header/HeaderDesk');
    var MapDesk = require('dviews/BgMapsDesk');

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

        this.mapDesk = new MapDesk();
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
                this.scrolldesk.goToPage.call(this.scrolldesk,data.index);
        }.bind(this))
        this.rootNode.add(this.headerDesk);

        this.scrolldesk.subscribe(this.headerDesk);
    }

    function _content() {
        this.scrolldesk = new ScrollDesk();

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
