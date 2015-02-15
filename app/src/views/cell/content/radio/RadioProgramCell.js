define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    /*Require App*/
    var VideoExtraSurfaceCell = require('cviews/content/radio/VideoExtraSurfaceCell');


    RadioProgramCell.prototype = Object.create(View.prototype);
    RadioProgramCell.prototype.constructor = RadioProgramCell;

    RadioProgramCell.DEFAULT_OPTIONS = {
        contentProps: {
            fontSize: "140%",
            opacity: '.7',
            color: 'floralwhite',
            textShadow: '1px 1px 1px black',
            padding: '15px',
            letterSpacing: '10px',
            textAlign: 'center',
            fontWeight: 'bold'
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
                size:[38,38],
                align: [0.5, 0.5],
                origin: [0.5, 0.75],
                opacity: function () {
                   return this.playTrans.get() ;
                }.bind(this)
            });


            var playDiv = document.createElement('div');
            var paper = Raphael(playDiv, 50,50);
            var path = paper.path("M6.684,25.682L24.316,15.5L6.684,5.318V25.682z").attr({
                fill: sv.scheme.sectionColor,
                stroke:'none'
            });
            path.transform('t10,10s2');

            var stopDiv = document.createElement('div');
            var stopPaper = Raphael(stopDiv, 50,50);
            var stopPath = stopPaper.path("M5.5,5.5h20v20h-20z").attr({
                fill: sv.scheme.sectionColor,
                stroke:'none'
            });
            stopPath.transform('t10,10s2');

            this.playSurf = new Surface({
                content: playDiv,
                properties: {
                    cursor: 'pointer',
                    zIndex:10
                }
            });

            this.stopMod= new Modifier({
                size:[38,38],
                align: [0.5, 0.5],
                origin: [0.5, 0.75],
                opacity: function () {
                   return this.stopTrans.get() ;
                }.bind(this)
            });

            this.stopSurf = new Surface({
                content: stopDiv,
                properties: {
                    cursor: 'pointer',
                    zIndex:0
                }
            });

            this.playSurf.on('click', function () {
                this.programSurf.play();
                this.playSurf.setOptions({properties:{zIndex:0}});
                this.stopSurf.setOptions({properties:{zIndex:10}});
                this.programSurf.setOptions({zIndex:0});

                this.playTrans.set(0, {duration:500});
                this.stopTrans.set(1, {duration:500});
            }.bind(this));

            this.stopSurf.on('click', function () {
                this.programSurf.pause();

                this.playSurf.setOptions({properties:{zIndex:10}});
                this.stopSurf.setOptions({properties:{zIndex:0}});

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
            align: [0.5, 0.1],
            origin: [0.5, 0.1]
        });
        this.programDateSurf = new Surface({
            content: this.options.date,
            properties: this.options.contentProps
        });
        this.rootNode.add(this.programDateMod).add(this.programDateSurf);
    }

    function _programContent() {
        var content = 'img/audio/' + this.options.mp3;
        this.programSurf = new VideoExtraSurfaceCell({
            autoplay: false,
            controls: true
        });


        this.programSurf.setContent(content);
        this.rootNode.add(this.programSurf);
        this.programSurf.pipe(this._eventOutput);
    }

    module.exports = RadioProgramCell;
});
