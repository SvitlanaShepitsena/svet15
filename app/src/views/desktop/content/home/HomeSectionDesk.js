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
        this.bgMod = new StateModifier({
            align: this.options.align,
            origin: this.options.origin
        });
        this.bg = new Surface({
            size: [undefined, undefined],
            content: '',
            classes: [],
            properties: {
                color: 'white',
                backgroundColor: window.sv.scheme.sectionColor,
                textAlign: 'center'
            }
        });
        this.add(this.bgMod).add(this.bg);
        this.rootNode = this.add(this.centerModifier);
    };

    function _contentParts() {
        this.textMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: function () {
                return Transform.translate(0, _getIconSize(), 0);
            }.bind(this)
        });
        this.surface = new Surface({
            content: this.options.content,
            properties: {
                color: window.sv.scheme.textWhite,
                cursor: 'pointer',
                textAlign: 'center'
            }
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.textMod).add(this.surface);
    }

    function _getIconSize() {
        if (window.innerWidth < window.innerHeight) {
            this.sizeIcon = window.innerWidth / 5.5;
        } else {
            this.sizeIcon = window.innerHeight / 5.5;
        }
        this.sizeIcon = this.sizeIcon > this.maxSize ? this.maxSize : this.sizeIcon;
        return this.sizeIcon;
    }

    function _sectionIcon() {
        this.transitionableName = new Transitionable(window.innerWidth / 5);
        this.maxSize = 180;
        this.sizeIcon;

        this.sectionIconMod = new Modifier({
            size: function () {
                _getIconSize.call(this);
                return [this.sizeIcon, this.sizeIcon];

            }.bind(this),
            transform: Transform.translate(0, 0, 0),
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
