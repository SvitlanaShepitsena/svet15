define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var BkImageSurface = require("famousimg/BkImageSurface");
    /*html*/
    var aboutDesk = require('text!dviews/jade/about/aboutUsDesk.html');

    AboutUsDesk.prototype = Object.create(View.prototype);
    AboutUsDesk.prototype.constructor = AboutUsDesk;

    AboutUsDesk.DEFAULT_OPTIONS = {
        viewProps: {
            boxShadow: '-1px 1px 2px 2px lightgrey',
            backgroundColor: window.sv.scheme.textWhite
        },
        contentProps: {
            paddingTop: '50px',
            lineHeight: '1.7em',
            float: 'left',
            textAlign: 'justify',
            color: window.sv.scheme.textDark
        }
    };

    function AboutUsDesk() {
        View.apply(this, arguments);

        this.viwMod = new Modifier({
            size: [undefined, window.sv.sizing.viewHeight],
            align: [0.5, 0.6],
            origin: [0.5, 0.6]
        });
        this.bgSurf = new Surface({
            properties: this.options.viewProps
        });
        this.bgSurf.pipe(this._eventOutput);
        this.rootNode = this.add(this.viwMod);
        this.rootNode.add(this.bgSurf);

        //_addImg.call(this);
        _addContent.call(this);
    }

    function _addImg() {
        this.imgMod = new Modifier({
            size: [200, undefined],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });

        var imageSurface = new BkImageSurface({
            content: 'img/aboutUs/aboutus_1.jpg',
            sizeMode: BkImageSurface.SizeMode.ASPECTFIT,
            positionMode: BkImageSurface.PositionMode.TOP,
            repeatMode: BkImageSurface.RepeatMode.NONE
        });
        this.rootNode.add(this.imgMod).add(imageSurface);

    }

    function _addContent() {
        this.aboutContMod = new Modifier({
            size: [undefined, undefined],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.aboutContSurf = new Surface({
            content: aboutDesk,
            properties: this.options.contentProps
        });

        this.aboutContSurf.pipe(this._eventOutput);
        this.rootNode.add(this.aboutContMod).add(this.aboutContSurf);
    };

    module.exports = AboutUsDesk;
});
