define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');

    var Transitionable = require("famous/transitions/Transitionable");

    MenuImageView.prototype = Object.create(View.prototype);
    MenuImageView.prototype.constructor = MenuImageView;
    MenuImageView.DEFAULT_OPTIONS = {};

    function MenuImageView(imagePath) {
        this.imagePath = imagePath;

        View.apply(this, arguments);
        _createImage.call(this);
        //_createContent.call(this);
    }

    function _createImage() {

        var imageTrans = new Transitionable(0.5);
        var imageModifier = new StateModifier({
            size: [window.innerWidth / 2, undefined],
            opacity: imageTrans.get(),
            origin: [.5, .5],
            align: [.5, .5]
        })
        var imageSurface = new Surface({
            size: [undefined, undefined],
            content: this.imagePath
        });
        imageSurface.on('click', function () {
            console.log('run');
            imageTrans.set(0, {during: 500});
        })
        this.add(imageModifier).add(imageSurface);
    }

    function _createContent() {

        var imageSurface = new Surface({
            size: [undefined, undefined],
            content: 'About us content'
        });
        this.add(imageSurface);
    }

    module.exports = MenuImageView;
});
