define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');

    var VideoExtraSurface = require('cviews/content/radio/VideoExtraSurface');

    RadioProgramCell.prototype = Object.create(View.prototype);
    RadioProgramCell.prototype.constructor = RadioProgramCell;

    RadioProgramCell.DEFAULT_OPTIONS = {
        contentProps: {
            fontSize: "80%",
            opacity: '.7',
            color: 'floralwhite',
            textShadow: '1px 1px 1px black',
            padding: '5px',
            letterSpacing: '1px',
            textAlign: 'center',
            fontWeight: 'bold',
            cursor: 'pointer'
        }
    };

    function RadioProgramCell() {
        View.apply(this, arguments);
        _init.call(this);
        _playerBg.call(this);
        _programContent.call(this);


        _radioProgramContent.call(this);
        _playStop.call(this);
    }
        function _playStop() {
            this.playTrans = new Transitionable(1);
            this.stopTrans = new Transitionable(0);

            this.playMod= new Modifier({
                align: [0.5, 0.5],
                origin: [0.5, 0.5],
                size: [undefined, undefined],
                opacity: function () {
                   return this.playTrans.get() ;
                }.bind(this)
            });

            this.playSurf = new Surface({
                size: [100, 20],
                content: 'Play',
                properties: {
                    backgroundColor: 'grey',
                    cursor: 'pointer'
                }
            });
            this.stopMod= new Modifier({
                align: [0.5, 0.5],
                origin: [0.5, 0.5],
                size: [undefined, undefined],
                opacity: function () {
                   return this.stopTrans.get() ;
                }.bind(this)
            });

            this.stopSurf = new Surface({
                size: [100, 20],
                content: 'Stop',
                properties: {
                    backgroundColor: 'grey',
                    cursor: 'pointer'
                }
            });

            this.playSurf.on('click', function () {
                this.programSurf.play();
                this.playTrans.set(0, {duration:500});
                this.stopTrans.set(1, {duration:500});
            }.bind(this));

            this.stopSurf.on('click', function () {
                this.programSurf.pause();
                this.playTrans.set(1, {duration:500});
                this.stopTrans.set(0, {duration:500});
            }.bind(this));

            this.rootNode.add(this.stopMod).add(this.stopSurf);
            this.rootNode.add(this.playMod).add(this.playSurf);

        }

    function _init() {
        this.zTrans = new Transitionable(0);
        this.centerModifier = new Modifier({
            transform: function () {
                return Transform.translate(0, 0, this.zTrans.get());
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    RadioProgramCell.prototype.setPerspective = function (perpective) {
        this.zTrans.halt();
        this.zTrans.set(perpective, {duration: 500});
        this.playerBgSurf.setOptions({
            properties: {
                zIndex: perpective
            }
        });
        this.programDateSurf.setOptions({
            properties: {
                zIndex: perpective
            }
        });
    };


    function _playerBg() {
        this.playerBgMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: this.options.opacity
        });
        this.playerBgSurf = new Surface({
            properties: {
                textAlign: 'center',
                borderStyle: 'groove',
                borderRadius: '2px',
                borderWidth: '3px',
                borderColor: this.options.borderColor,
                backgroundColor: this.options.bg
            }
        });
        this.playerBgSurf.pipe(this._eventOutput);
        this.rootNode.add(this.playerBgMod).add(this.playerBgSurf);
    }

    function _radioProgramContent() {
        this.programDateMod = new Modifier({
            size: [undefined, true],
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.programDateSurf = new Surface({
            content: this.options.date,
            properties: this.options.contentProps
        });
        this.programDateSurf.pipe(this._eventOutput);
        this.rootNode.add(this.programDateMod).add(this.programDateSurf);
    }

    function _programContent() {
        var content = 'img/audio/' + this.options.mp3;
        this.programSurf = new VideoExtraSurface({
            autoplay: false,
            controls: true
        });


        this.programSurf.setContent(content);
        this.rootNode.add(this.programSurf);


            this.programSurf.pipe(this._eventOutput);
    }

    module.exports = RadioProgramCell;
});
