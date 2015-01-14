define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var StateModifier = require('famous/modifiers/StateModifier');

    function HomePart() {
        View.apply(this, arguments);
        _init.call(this);
        _content.call(this);
    }

    function _content() {
        this.surface = new Surface({
            size: [undefined, undefined],
            content: this.options.content,
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.surface);
    }

    function _init() {
        this.centerModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(this.options.sign * (window.innerWidth / 2), 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
        this.centerModifier.setTransform(Transform.translate(0, 0, 0), {duration: 400})
    }

    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {};

    module.exports = HomePart;
});
