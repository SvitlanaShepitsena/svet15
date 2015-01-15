define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var StateModifier = require('famous/modifiers/StateModifier');

    function HomePart() {
        View.apply(this, arguments);

        _initTransform.call(this);
        _contentParts.call(this);
    }

    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {
        center: [0.5, 0, 5],
        content: null,
        curve: null,
        duration: 0,
        sign: 0,
        size: [undefined, undefined],
        width: window.innerWidth,
        sectionPop: {
            color: 'white',
            textAlign: 'center',
            backgroundColor: '#FA5C4F'
        }
    };

    function _contentParts() {
        this.surface = new Surface({
            size: this.options.size,
            content: this.options.content,
            properties: this.options.sectionPop
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.surface);
    }

    function _initTransform() {
        this.centerModifier = new StateModifier({
            align: this.options.center,
            origin: this.options.center,
            transform: Transform.translate(this.options.sign * (this.options.width / 2), 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
        this.centerModifier.setTransform(Transform.translate(0, 0, 0), {
            duration: this.options.duration,
            curve: this.options.curve
        })
    }

    module.exports = HomePart;
});
