define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var VideoSurface = require("famous/surfaces/VideoSurface");

    function RadioProgram() {
        View.apply(this, arguments);
        _init.call(this);
        _programContent.call(this);
    }

    function _programContent() {
        this.surface = new VideoSurface({
            size: [undefined, undefined],
            content: 'radio/' + this.options.mp3
        });
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    RadioProgram.prototype = Object.create(View.prototype);
    RadioProgram.prototype.constructor = RadioProgram;

    RadioProgram.DEFAULT_OPTIONS = {};

    module.exports = RadioProgram;
});
