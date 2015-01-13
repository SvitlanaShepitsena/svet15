define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require("famous/core/Modifier");

    AboutUsCell.prototype = Object.create(View.prototype);
    AboutUsCell.prototype.constructor = AboutUsCell;
    AboutUsCell.DEFAULT_OPTIONS = {};

    function AboutUsCell(options) {
        View.apply(this, arguments);
        _init.call(this);
        _content.call(this);
    }

    function _content() {
        this.content = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });

        this.rootNode.add(this.content);

    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);

    }

    module.exports = AboutUsCell;
});
