define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');

    var Transitionable = require("famous/transitions/Transitionable");
    var about1 = require('jade/aboutText1');

    MenuImageView.prototype = Object.create(View.prototype);
    MenuImageView.prototype.constructor = MenuImageView;
    MenuImageView.DEFAULT_OPTIONS = {};

    function MenuImageView(imagePath) {
        var that = this;
        this.imagePath = imagePath;

        this.TRANSITION = {duration: 700, curve: 'linear'};

        this.state = new Transitionable(0);
        var isText = false;

        View.apply(this, arguments);

        // Modifier to center renderables
        var centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });


        this.rootNode = this.add(centerModifier);


        _createContent.call(this);
        _createImage.call(this);
        var dummySurface = new Surface({
            properties: {
                textAlign: 'center',
                cursor: 'pointer',
                zIndex: 1
            }
        })
        this.rootNode.add(dummySurface);

        dummySurface.on('click', function () {
            var finalState = isText ? 1 : 0;
            that.state.set(finalState, that.TRANSITION);
            isText = !isText;
        })
    }

    function _createImage() {
        var that = this;

        this.imageModifier = new Modifier({
            size: [window.innerWidth / 2, undefined],
            opacity: function () {
                return 1 - that.state.get()
            },
            origin: [.5, .5],
            align: [.5, .5]
        })
        var imageSurface = new Surface({
            size: [undefined, undefined],
            content: this.imagePath
        });

        this.rootNode.add(this.imageModifier).add(imageSurface);
    }

    function _createContent() {
        var that = this;

        this.contentModifier = new Modifier({
            size: [window.innerWidth / 2, undefined],
            opacity: function () {
                return that.state.get()
            },
            origin: [.5, .5],
            align: [.5, .5]
        })
        var contentSurface = new Surface({
            size: [undefined, undefined],
            content: about1
        });

        this.rootNode.add(this.contentModifier).add(contentSurface);
    }


    module.exports = MenuImageView;
});
