define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    //var aboutDesk = require('text!dviews/jade/about/about-desk.html');
    var aboutDesk = require('text!dviews/jade/about/aboutUsPage.html');

    function AboutUsDesk() {
        View.apply(this, arguments);
        this.contentHeight = window.innerWidth / 2;

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.surface = new Surface({
            content: aboutDesk,
            classes: [],
            properties: {
                paddingTop: window.sv.sizing.headerHeight * 1.2 + 'px',
                paddingLeft: '25px',
                paddingRight: '25px',
                color: window.sv.scheme.textDark,
                textAlign: 'center',
                backgroundColor: window.sv.scheme.aboutDesk
            }
        });

        this.surface.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    AboutUsDesk.prototype = Object.create(View.prototype);
    AboutUsDesk.prototype.constructor = AboutUsDesk;

    AboutUsDesk.DEFAULT_OPTIONS = {};

    module.exports = AboutUsDesk;
});
