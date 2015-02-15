define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var RadioScrollDesk = require('dviews/content/radio/RadioScrollDesk');

    var radioDesk = require('text!dviews/jade/radio/radio-desk.html');

    RadioDesk.prototype = Object.create(View.prototype);
    RadioDesk.prototype.constructor = RadioDesk;

    RadioDesk.DEFAULT_OPTIONS = {
        viewProps: {
            boxShadow: window.sv.scheme.boxShadow,
            background: "#595153 url('img/bg/radio-desk.jpg')"
        },
        radioProps: {
            paddingTop: '50px',
            color: window.sv.scheme.textDark,
            textAlign: 'center'
        }
    };

    function RadioDesk() {
        View.apply(this, arguments);

        this.viewMod = new Modifier({
            //size: [undefined, window.sv.sizing.viewHeight]
        });
        this.viewSurf = new Surface({
            properties: this.options.viewProps
        });

        this.viewSurf.pipe(this._eventOutput);
        this.rootNode = this.add(this.viewMod);
        this.rootNode.add(this.viewSurf);

        _svRadio.call(this);
        _scrollPrograms.call(this);
    }

    function _svRadio() {
        this.viewHeaderMod = new Modifier({
            size: [undefined, true]
        });
        this.viewHeaderSurf = new Surface({
            content: radioDesk,
            properties: this.options.radioProps
        });
        this.viewHeaderSurf.pipe(this._eventOutput);
        this.rootNode.add(this.viewHeaderMod).add(this.viewHeaderSurf);
    }

    function _scrollPrograms() {
        this.scrollMod = new Modifier({
            size: [500, 400],
            align: [0.5, 0.8],
            origin: [0.5, 0.8]
        });
        this.radioScrollDesk = new RadioScrollDesk();
        this.rootNode.add(this.scrollMod).add(this.radioScrollDesk);
    }

    module.exports = RadioDesk;
});
