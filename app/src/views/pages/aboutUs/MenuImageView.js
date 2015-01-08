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

    MenuImageView.prototype = Object.create(View.prototype);
    MenuImageView.prototype.constructor = MenuImageView;

    function MenuImageView(imagePath, order) {

        var that = this;
        this.imagePath = imagePath;
        var jadePath = 'text!jade/about' + order + '.html';
        this.content = require(jadePath);
        this.TRANSITION = {duration: 700, curve: 'linear'};

        this.state = new Transitionable(0);
        var isText = false;

        View.apply(this, arguments);

        // Modifier to center renderables
        this.centerModifier = new Modifier({
            size: [this.options.contentWidth, undefined],
            align: this.options.align,
            origin: this.options.origin
        });
        this.rootNode = this.add(this.centerModifier);
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
            var finalState = isText ? 0 : 1;
            that.state.set(finalState, that.TRANSITION);
            isText = !isText;
        })
    }

    MenuImageView.DEFAULT_OPTIONS = {
        contentWidth: window.innerWidth * .9,
        width: window.innerWidth,
        topMargin: window.innerHeight * .015,
        origin: [.5, .5],
        align: [.5, .5]
    };

    function _createImage() {
        var that = this;

        this.imageModifier = new Modifier({
            size: [that.options.width / 1.55, undefined],
            opacity: function () {
                return 1 - that.state.get()
            },
            origin: that.options.origin,
            align: that.options.align
        })
        var imageSurface = new Surface({
            content: this.imagePath
        });

        this.rootNode.add(this.imageModifier).add(imageSurface);
    }

    function _createContent() {
        var that = this;

        this.contentModifier = new Modifier({
            size: [that.options.contentWidth, undefined],
            opacity: function () {
                return that.state.get()
            },
            transform: Transform.translate(0, that.options.topMargin, 0)
        });
        var contentSurface = new Surface({
            content: that.content
        });

        this.rootNode.add(this.contentModifier).add(contentSurface);
    }

    module.exports = MenuImageView;
});
