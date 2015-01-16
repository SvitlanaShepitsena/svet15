define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

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
        spring: null,
        period: 0,
        dampingRatio: 0,
        sign: 0,
        size: [undefined, undefined],
        width: window.innerWidth,
        sectionPop: {
            color: 'white',
            paddingTop: '15px',
            textAlign: 'center',
            backgroundColor: window.sv.scheme.sectionColor
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
        this.spring = {
            method: 'spring',
            period: this.options.period,
            dampingRatio: this.options.dampingRatio
        }
        this.centerModifier = new StateModifier({
            align: this.options.center,
            origin: this.options.center,
            transform: Transform.translate(this.options.sign * (this.options.width / 2), 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
        this.centerModifier.setTransform(Transform.translate(0, 0, 0), this.spring);
    }

    module.exports = HomePart;
});
