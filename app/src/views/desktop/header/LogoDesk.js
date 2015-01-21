define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var mysvg = require('text!dviews/jade/svgtraining.html');

    function LogoDesk() {
        View.apply(this, arguments);
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        _logo.call(this);
    }

    function _logo() {
        //var imageSurface = new ImageSurface();
        //imageSurface.setContent('img/logo.png');
        this.svgSurface = new Surface({
            size: [undefined, undefined],
            content: mysvg
            //content: '<svg width="100" height="100"> <circle cx="50" cy="50" r="40" stroke="red" stroke-width="4" fill="yellow" /> </svg>'
        });
        this.rootNode.add(this.svgSurface);
    }

    LogoDesk.prototype = Object.create(View.prototype);
    LogoDesk.prototype.constructor = LogoDesk;

    LogoDesk.DEFAULT_OPTIONS = {};

    module.exports = LogoDesk;
});
