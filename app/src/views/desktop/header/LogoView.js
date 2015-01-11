define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function LogoView() {
        View.apply(this, arguments);
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier) ;
        _logo.call(this);
    }

    function _logo() {
        var imageSurface = new ImageSurface();
        imageSurface.setContent('img/logo.png');


        this.rootNode.add(imageSurface);
    }

    LogoView.prototype = Object.create(View.prototype);
    LogoView.prototype.constructor = LogoView;

    LogoView.DEFAULT_OPTIONS = {};

    module.exports = LogoView;
});
