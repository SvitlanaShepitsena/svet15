define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");
    /*App Require*/
    var NavItemDesk = require('dviews/header/NavItemDesk');


    NavDesk.prototype = Object.create(View.prototype);
    NavDesk.prototype.constructor = NavDesk;

    NavDesk.DEFAULT_OPTIONS = {
        gridDimentions: [3, 1],
        gridDirection: 0,
        size: [window.sv.sizing.navContainerWidth, undefined],
        align: [0, 0],
        origin: [0, 0],
        navTitles: null
    };

    function NavDesk() {
        View.apply(this, arguments);
        this.centerModifier = new Modifier({
            size: this.options.size,
            align: this.options.align,
            origin: this.options.origin
        });
        this.rootNode = this.add(this.centerModifier);
        _grid.call(this);
    }

    function _grid() {
        this.grid = new GridLayout({
            dimensions: this.options.gridDimentions,
            direction: this.options.gridDirection
        });

        this.navs = [];
        this.titles = this.options.navTitles;
        for (var i = 0; i < this.titles.length; i++) {
            this.title = this.titles[i];
            this.navItemDesk = new NavItemDesk({
                title: this.title,
                index: i
            });
            this.navItemDesk.pipe(this._eventOutput);
            this.navs.push(this.navItemDesk);
        }
        this.grid.sequenceFrom(this.navs);
        this.rootNode.add(this.grid);
    }

    module.exports = NavDesk;
});
