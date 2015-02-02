define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var VideoExtraSurface = require('dviews/content/radio/VideoExtraSurface');

    function RadioProgram() {
        View.apply(this, arguments);
        _init.call(this);
        _bg.call(this);
        _programContent.call(this);
        _playStop.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [600, undefined],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }



    function _playStop() {
    }

    function _bg() {
        this.bgMod = new Modifier({
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.bgSurface = new Surface({
            content: '',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                borderStyle: 'groove',
                borderRadius: '9px',
                borderWidth: '3px',
                borderColor: '#595959',
                backgroundColor: this.options.bg
            }
        });
        this.rootNode.add(this.bgMod).add(this.bgSurface);

        this.bgSurface.pipe(this._eventOutput);
    }

    function _programContent() {
        var content = 'img/audio/' + this.options.mp3;
        this.progSurface = new VideoExtraSurface({
            autoplay: false,
            controls: true
        });
        this.progSurface.setContent(content);
        this.rootNode.add(this.progSurface);
        this.progSurface.pipe(this._eventOutput);
    }


    RadioProgram.prototype = Object.create(View.prototype);
    RadioProgram.prototype.constructor = RadioProgram;

    RadioProgram.DEFAULT_OPTIONS = {};

    module.exports = RadioProgram;
});
