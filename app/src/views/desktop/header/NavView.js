define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");
    var ImageSurface = require('famous/surfaces/ImageSurface');

    function NavView() {

        View.apply(this, arguments);


        this.centerModifier = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(70, 40, 0)
        });
        this.rootNode = this.add(this.centerModifier);

        _grid.call(this);

    }

    function _grid() {
        this.grid = new GridLayout({
            dimensions: [6, 1],
            direction:0
        });

        this.navs = [];
        var icons = ['home', 'about-us', 'clients', 'demographics', 'radio', 'contact-us'];

        for (var i = 0; i < 6; i++) {
            var imageSurface = new ImageSurface({
                size:[110,150]
            });
            imageSurface.setContent('img/d-nav/d-' + icons[i] + '.png');
            this.navs.push(imageSurface);
        }

        this.grid.sequenceFrom(this.navs);
        this.rootNode.add(this.grid);
    }

    NavView.prototype = Object.create(View.prototype);
    NavView.prototype.constructor = NavView;

    NavView.DEFAULT_OPTIONS = {};

    module.exports = NavView;
});
