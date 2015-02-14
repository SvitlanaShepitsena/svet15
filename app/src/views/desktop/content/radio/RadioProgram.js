define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');

    var VideoExtraSurface = require('dviews/content/radio/VideoExtraSurface');


    RadioProgram.prototype = Object.create(View.prototype);
    RadioProgram.prototype.constructor = RadioProgram;


    RadioProgram.prototype.setPerspective = function (perpective) {
        this.zTrans.halt();
        this.zTrans.set(perpective, {duration: 300});

        this.bgSurface.setOptions({
            properties:{
                zIndex:  perpective
            }
        });
        this.contentSurf.setOptions({
            properties:{
                zIndex:  perpective
            }
        });

    };

    RadioProgram.DEFAULT_OPTIONS = {
        contentProps: {
            fontSize: "20px",
            padding: '15px',
            letterSpacing: '10px',
            fontFamily: "Open Sans Condensed",
            textAlign: 'center',
            fontWeight: 'bold',
            color: window.sv.scheme.textDark
        }
    };

    function RadioProgram() {
        View.apply(this, arguments);
        _init.call(this);
        _bg.call(this);
        _programContent.call(this);
        _playStop.call(this);
        _radioProgramContent.call(this);
    }

    function _init() {
        this.zTrans = new Transitionable(0);
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: function () {
                return Transform.translate(0, 0, this.zTrans.get());
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }


    function _playStop() {
    }

    function _bg() {
        this.bgMod = new Modifier({
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, this.zTrans.get())
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

    function _radioProgramContent() {

        this.contentMod = new Modifier({
            size: [300, 50],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 30, 0)
        });

        this.contentSurf = new Surface({
            content: this.options.date,
            classes: ['panel', 'panel-default'],
            properties: this.options.contentProps

        });
        this.rootNode.add(this.contentMod).add(this.contentSurf);
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


    module.exports = RadioProgram;
});
