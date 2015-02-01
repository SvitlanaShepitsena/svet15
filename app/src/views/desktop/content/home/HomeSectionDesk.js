define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RenderNode = require('famous/core/RenderNode');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transitionable = require('famous/transitions/Transitionable');

    function HomePart() {
        View.apply(this, arguments);

        this.sectionWidth = (window.sv.sizing.contentWidth / 4) * .9;
        this.sectionIconWidth = this.sectionWidth * .7;
        this.sectionImgWidth = this.sectionIconWidth * .7;
        this.centerImg = (this.sectionIconWidth - this.sectionImgWidth) / 2;
        this.contentPosition = this.sectionIconWidth * 1.1;
        this.maxSize = 130;
        this.maxSectionHeight = 445;

        _init.call(this);
        _contentParts.call(this);
        _sectionIcon.call(this);
    }

    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {
        align: [0, 0],
        origin: [0, 0],
        content: null,
        icon: null
    }

    function _getIconSize() {
        if (window.innerWidth < window.innerHeight) {
            this.sizeIcon = window.innerWidth / 7;
        } else {
            this.sizeIcon = window.innerHeight / 7;
        }
        this.sizeIcon = this.sizeIcon > this.maxSize ? this.maxSize : this.sizeIcon;
        return this.sizeIcon;
    }

    function _getSectionHeight() {
        if (window.innerWidth < window.innerHeight) {
            this.sectionHeight = window.innerWidth;
        } else {
            this.sectionHeight = window.innerWidth;
        }
        this.sectionHeight = this.sectionHeight > this.maxSectionHeight ? this.maxSectionHeight : this.sectionHeight;
        return this.sectionHeight;
    }

    function _init() {
        this.sectionHeight;
        this.centerModifier = new StateModifier({
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.bgMod = new Modifier({
            opacity: '.3',
            size: function () {
                _getSectionHeight.call(this);
                return [undefined, this.sectionHeight];
            }.bind(this)
        });
        this.bg = new Surface({
            properties: {
                color: 'white',
                backgroundColor: window.sv.scheme.sectionColor,
                textAlign: 'center'
            }
        });
        this.bg.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.add(this.bgMod).add(this.bg);
    };

    function _contentParts() {
        this.sizeIcon;
        this.textMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: function () {
                _getIconSize.call(this);
                return Transform.translate(0, this.sizeIcon + 15, 0);
            }.bind(this)
        });
        this.surface = new Surface({
            content: this.options.content,
            properties: {
                zIndex: 3,
                color: window.sv.scheme.textWhite,
                cursor: 'pointer',
                textAlign: 'center'
            }
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.textMod).add(this.surface);
    }


    function _sectionIcon() {
        this.sizeIcon;

        this.sectionIconMod = new Modifier({
            size: function () {
                _getIconSize.call(this);
                return [this.sizeIcon, this.sizeIcon];

            }.bind(this),
            transform: Transform.translate(0, 15, 0),
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.sectionIconSurface = new Surface({
            properties: {
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: this.sectionIconWidth / 2 + 'px',
                backgroundColor: window.sv.scheme.homeIconColor
            }
        });

        this.sectionIconSurface.pipe(this._eventOutput);
        this.sectionImgMod = new Modifier({
            size: function () {
                _getIconSize.call(this);
                return [this.sizeIcon * .7, this.sizeIcon * .7];
            }.bind(this),
            transform: function () {
                _getIconSize.call(this);
                return Transform.translate(0, (this.sizeIcon * .4) / 1.5, 0);
            }.bind(this),
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.sectionImgSurface = new ImageSurface({
            content: "img/home-page/icons-color/" + this.options.icon + ".png",
            properties: {
                cursor: 'pointer',
                textAlign: 'center'
            }
        });
        this.sectionImgSurface.pipe(this._eventOutput);


        this.sectionIconSurface.pipe(this._eventOutput);
        this.rootNode.add(this.sectionImgMod).add(this.sectionImgSurface);
        this.rootNode.add(this.sectionIconMod).add(this.sectionIconSurface);
    }


    module.exports = HomePart;
});
