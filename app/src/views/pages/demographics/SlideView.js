/*** SlideView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable   = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);


    function SlideView(bg) {
        this.bg = bg;
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            align: [0.5, 0.0],
            origin: [0.5, 0.0],
            size: this.options.size
        });

        this.mainNode = this.add(this.rootModifier);

        _createBackground.call(this);
        _createPhoto.call(this);
    }

    SlideView.prototype = Object.create(View.prototype);
    SlideView.prototype.constructor = SlideView;

    SlideView.DEFAULT_OPTIONS = {
        size: [400, 450],
        filmBorder: 15,
        photoBorder: 3,
        angle: -0.5
    };

    function _createBackground() {
        var background = new Surface({
            properties: {
                backgroundColor: '#FFFFF5',
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer'
            }
        });

        this.mainNode.add(background);

        background.on('click', function() {
            this._eventOutput.emit('click');
        }.bind(this));
    }



    function _createPhoto() {

        var photo = new Surface({
            size: this.options.size,
            properties: {
                backgroundColor: this.bg,
                zIndex: 2,
                pointerEvents: 'none'
            }
        });

        this.photoModifier = new StateModifier({
            origin: [0.5, 0],
            align: [0.5, 0],
            transform: Transform.translate(0, this.options.filmBorder + this.options.photoBorder, 0.1)
        });

        this.mainNode.add(this.photoModifier).add(photo);
    }

    SlideView.prototype.fadeIn = function() {
        this.photoModifier.setOpacity(1, { duration: 1500, curve: 'easeIn' });
        this.shake();
    };

    SlideView.prototype.shake = function() {
        this.rootModifier.halt();

        this.rootModifier.setTransform(
            Transform.rotateX(this.options.angle),
            { duration: 200, curve: 'easeOut' }
        );

        this.rootModifier.setTransform(
            Transform.identity,
            { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
    };

    module.exports = SlideView;
});
