define(function (require, exports, module) {

    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");

    var ImageSurface = require('famous/surfaces/ImageSurface');
    var NavItemDesk = require('dviews/header/NavItemDesk');

    function NavDesk() {

        View.apply(this, arguments);
        this.centerModifier = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        _grid.call(this);
    }

    function _grid() {
        var that = this;
        this.grid = new GridLayout({
            dimensions: [3, 1],
            direction: 0
        });
        this.navs = [];

        var titles = this.options.menuTitles;
        for (var i = 0; i < titles.length; i++) {
            var title = titles[i];
            var navItemDesk = new NavItemDesk({
                title: title,
                index: i
            });
            navItemDesk.pipe(this._eventOutput);
            this.navs.push(navItemDesk);
        }

        this.grid.sequenceFrom(this.navs);
        this.rootNode.add(this.grid);


    }

    NavDesk.prototype = Object.create(View.prototype);
    NavDesk.prototype.constructor = NavDesk;

    NavDesk.DEFAULT_OPTIONS = {};

    module.exports = NavDesk;
});
