define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RenderNode = require('famous/core/RenderNode');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transitionable = require('famous/transitions/Transitionable');

    var Flipper = require('famous/views/Flipper');

    function HomePart() {
        View.apply(this, arguments);

        this.sectionWidth = (window.sv.sizing.contentWidth / 4) * .9;
        this.sectionHeight = (window.sv.sizing.contentHeight - window.sv.sizing.headerHeight) / 2

        this.sectionIconWidth = this.sectionWidth * .7;
        this.sectionImgWidth = this.sectionIconWidth * .7;
        this.centerImg = (this.sectionIconWidth - this.sectionImgWidth) / 2;
        this.contentPosition = this.sectionIconWidth * 1.1;

        _init.call(this);
        _contentParts.call(this);
        _sectionIcon.call(this);
    }

    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {
        content: null,
        icon: null,
        width: window.innerWidth
    }

    function _init() {

        this.centerModifier = new StateModifier({
            align: this.options.align,
            origin: this.options.origin
        });
        this.rootNode = this.add(this.centerModifier);
    };

    function _contentParts() {
        this.surface = new Surface({
            content: this.options.content,
            properties: {
                paddingTop: this.contentPosition + 'px',
                color: window.sv.scheme.textWhite,
                backgroundColor: window.sv.scheme.sectionColor,
                cursor: 'pointer',
                textAlign: 'center'
            }
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.surface);
    }

    function _sectionIcon() {
        this.transitionableName = new Transitionable(window.innerWidth / 5);

        this.sectionIconMod = new Modifier({
            size: function () {
                if (window.innerWidth < window.innerHeight) {
                    return [window.innerWidth / 5, window.innerWidth / 5]
                }
                    return [window.innerHeight / 5, window.innerHeight / 5]

            }.bind(this),
            transform: Transform.translate(0, 30, 0),
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.sectionIconSurface = new ImageSurface({
            content: "img/home-page/icons-color/" + this.options.icon + ".png",
            properties: {
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: this.sectionIconWidth / 2 + 'px',
                backgroundColor: window.sv.scheme.homeIconColor
            }
        });
        this.sectionIconSurface.pipe(this._eventOutput);
        this.rootNode.add(this.sectionIconMod).add(this.sectionIconSurface);
    }


    module.exports = HomePart;
});
