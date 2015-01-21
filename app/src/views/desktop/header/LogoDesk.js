define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var logosvg = require('text!dviews/jade/svgtraining.html');


    function LogoDesk() {
        View.apply(this, arguments);
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        _logoSvg.call(this);
        _rmgText.call(this);
        _svetText.call(this);
    }

    function _logoSvg() {
        this.logoSvgMod = new Modifier({
            size: [undefined, undefined],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.logoSvgSurf = new Surface({
            size: [undefined, undefined],
            content: logosvg,
            classes: [],
            properties: {
                color: 'white',
                backgroundColor: 'grey',
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.logoSvgMod).add(this.logoSvgSurf);

    }

    function _svetText() {
        this.svetTextMod = new Modifier({
            size: [undefined, 30],
            align: [0.5, 1],
            origin: [0.5, 1],
            transform: Transform.translate(0, 0, 0)
        });
        this.svetTextSurf = new Surface({
            size: [undefined, undefined],
            content: 'SVET',
            properties: {
                fontSize: '30px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.svetTextMod).add(this.svetTextSurf);
    }

    function _rmgText() {
        this.mediaMod = new Modifier({
            size: [undefined, 50],
            align: [0.5, 1],
            origin: [0.5, 1],
            transform: Transform.translate(0, 0, 0)
        });
        this.mediaSurface = new Surface({
            size: [undefined, undefined],
            content: 'RUSSIAN MEDIA GROUP',
            classes: [],
            properties: {
                color: 'white',
                fontSize: '21px',
                textAlign: 'center'
            }
        });

        var imageSurface = new ImageSurface();
        imageSurface.setContent('img/logo.png');
        //this.svgSurface = new Surface({
        //    size: [undefined, undefined],
        //    content: mysvg
        //});
        this.rootNode.add(this.mediaMod).add(this.mediaSurface);
    }

    LogoDesk.prototype = Object.create(View.prototype);
    LogoDesk.prototype.constructor = LogoDesk;

    LogoDesk.DEFAULT_OPTIONS = {};

    module.exports = LogoDesk;
});
