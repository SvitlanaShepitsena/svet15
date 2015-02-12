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
            size: [undefined, window.sv.sizing.viewHeight]
        });
        this.mapSurface = new Surface({
            properties: this.options.viewProps
        });

        this.mapSurface.pipe(this._eventOutput);
        this.rootNode = this.add(this.viewMod);
        this.rootNode.add(this.mapSurface);

        _svRadio.call(this);
        _scrollPrograms.call(this);
    }

    function _scrollPrograms() {
        this.scrollMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            size: [600, 400],
            transform: Transform.translate(0, 90, 0)
        });
        this.radioScrollDesk = new RadioScrollDesk();
        this.rootNode.add(this.scrollMod).add(this.radioScrollDesk);
    }

    function _svRadio() {
        this.radivoMod = new Modifier({});
        this.radivoSurf = new Surface({
            content: radioDesk,
            properties: this.options.radioProps
        });
        this.radivoSurf.pipe(this._eventOutput);
        this.rootNode.add(this.radivoMod).add(this.radivoSurf);
    }

    module.exports = RadioDesk;
});
