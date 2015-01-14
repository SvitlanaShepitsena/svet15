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
            transform: Transform.translate(30, 40, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        this._eventInput.pipe(this._eventOutput);
        
        _grid.call(this);

    }

    function _grid() {
        var that = this;
        this.grid = new GridLayout({
            dimensions: [6, 1],
            direction: 0
        });

        this.navs = [];
        var icons = ['home', 'about-us', 'clients', 'demographics', 'radio', 'contact-us'];

        for (var i = 0; i < icons.length; i++) {
            var navItemDesk = new NavItemDesk({
                itemUrl: 'img/d-nav/d-' + icons[i] + '.png',
                index: i
            });
            navItemDesk.pipe(this._eventOutput);
            this.navs.push(navItemDesk);
        }

        this.grid.sequenceFrom(this.navs);
        this.rootNode.add(this.grid);

        this.on('navigateTo', function (index) {
            console.log(index);
        })
    }

    NavDesk.prototype = Object.create(View.prototype);
    NavDesk.prototype.constructor = NavDesk;

    NavDesk.DEFAULT_OPTIONS = {};

    module.exports = NavDesk;
});
