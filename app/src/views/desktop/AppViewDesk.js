define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var ScrollDesk = require('dviews/content/ScrollDesk');
    var HeaderDesk = require('dviews/header/HeaderDesk');


    AppViewDesk.DEFAULT_OPTIONS = {};

    function AppViewDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _navigation.call(this);
        _content.call(this);
        _header.call(this);
    }

    function _header() {
        this.headerDesk = new HeaderDesk();
        this.rootNode.add(this.headerDesk);
    }

    function _content() {
        this.scrolldesk = new ScrollDesk();

        this.scrolldesk.on('decrease:header', function () {
            this.headerDesk.resizeHeader.call(this.headerDesk, 50);
        }.bind(this));

        this.scrolldesk.on('increase:header', function () {
            this.headerDesk.resizeHeader.call(this.headerDesk, 100);
        }.bind(this));

        this.rootNode.add(this.scrolldesk);
    }

    function _navigation() {
        this.on('navigateTo', function (index) {
            this.layout.content.scrollview.goToPage(index);
        })
    }


    function _init() {
        var centerModifier = new Modifier({
            align: this.options.centerModifier,
            origin: this.options.centerModifier,
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(centerModifier);
    }

    AppViewDesk.prototype = Object.create(View.prototype);
    AppViewDesk.prototype.constructor = AppViewDesk;

    module.exports = AppViewDesk;
});
