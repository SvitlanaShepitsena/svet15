define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable = require('famous/transitions/Transitionable');

    function CommonSlideCell() {
        View.apply(this, arguments);
        _createBackground.call(this);
        _createViewContent.call(this);
    }

    CommonSlideCell.prototype = Object.create(View.prototype);
    CommonSlideCell.prototype.constructor = CommonSlideCell;

    CommonSlideCell.DEFAULT_OPTIONS = {
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        bg: 'grey',
        boxShadow: '0 2px 4px -2px rgba(0, 0, 0, 0.5)',
        width: window.innerWidth,
        height: window.innerHeight
    };

    function _createBackground() {
        this.rootModifier = new StateModifier({
            align: this.options.align,
            origin: this.options.origin,
            size: [undefined, undefined]
        });
        this.background = new Surface({
            properties: {
                backgroundColor: this.options.bg,
                boxShadow: this.options.boxShadow,
                cursor: 'pointer'
            }
        });

        this.background.pipe(this._eventOutput);
        this.rootNode = this.add(this.rootModifier);
        this.rootNode.add(this.background);
    }

    function _createViewContent() {
        this.contentModifier = new StateModifier({
            align: this.options.align,
            origin: this.options.origin,
            size: [this.options.width * .9, this.options.height * .8],
            transform: Transform.translate(0, 0, 2)
        });
        this.viewContent = new Surface({
            content: require('text!cviews/jade/' + this.options.folder + '/' + this.options.content + '.html'),
            properties: {
                textAlign: 'center',
                zIndex: 2,
                pointerEvents: 'none'
            }
        });
        this.rootNode.add(this.contentModifier).add(this.viewContent);
    }

    module.exports = CommonSlideCell;
});
