define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var RadioScrollDesk = require('dviews/content/radio/RadioScrollDesk');

    var radioDesk = require('text!dviews/jade/radio/radio-desk.html');

    function RadioDesk() {
        View.apply(this, arguments);
        this.contentHeight = window.innerWidth / 2;

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.surfaceBg = new Surface({
            classes: [],
            properties: {
                paddingLeft: '25px',
                paddingRight: '25px',
                color: window.sv.scheme.textDark,
                textAlign: 'center',
                backgroundColor: window.sv.scheme.textWhite
            }
        });

        this.surfaceBg.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surfaceBg);
        _pic.call(this);
        _radivo.call(this);
        _scrollPrograms.call(this);
    }

    function _pic() {
        this.picMod = new Modifier({
            size: [130, 130],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 200, 0)
        });
        this.picImgSurf = new ImageSurface({
            size: [true, true],
            content: "img/alex.jpg"
        });
        this.rootNode.add(this.picMod).add(this.picImgSurf);
    }

    function _scrollPrograms() {
        this.scrollMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            size: [600, 400]
        });
        this.radioScrollDesk = new RadioScrollDesk();
        this.rootNode.add(this.scrollMod).add(this.radioScrollDesk);

    }

    function _radivo() {

        this.radivoMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, sv.sizing.headerSmallHeight, 0)
        });

        this.radivoSurf = new Surface({
            content: radioDesk,
            properties: {
                marginTop: '30px',
                color: window.sv.scheme.textDark,
                textAlign: 'center'
            }
        });
        this.radivoSurf.pipe(this._eventOutput);
        this.rootNode.add(this.radivoMod).add(this.radivoSurf);

    }

    RadioDesk.prototype = Object.create(View.prototype);
    RadioDesk.prototype.constructor = RadioDesk;

    RadioDesk.DEFAULT_OPTIONS = {};

    module.exports = RadioDesk;
});
