define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    var RadioProgram = require('dviews/content/radio/RadioProgram');

    function RadioScrollDesk() {
        View.apply(this, arguments);
        this.iconElements = [];
        _init.call(this);
        _scrollRadio.call(this);
        _buttonsScroll.call(this);
    }

    function _init() {
        this.centerMod = new Modifier({
            size: [undefined, undefined],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerMod);
    }

    function _getRaphaelRadioIcon(file) {
        var divDaily = document.createElement('div');
        var paper = Raphael(divDaily, 40, 50);
        var element = paper.path(file).attr({fill: window.sv.scheme.lightRed, stroke: 'none'});
        element.transform('t5 15, s2');
        this.iconElements.push(element);
        return divDaily;
    }

    function _buttonsScroll() {
        var navBackIcon = 'M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z'
        var navForwardIcon = 'M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z'

        this.backMod = new Modifier({
            size: [50, 70],
            align: [0, 0.5],
            origin: [0, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.backSurf = new Surface({
            content: _getRaphaelRadioIcon.call(this, navBackIcon),
            properties: {
                cursor: 'pointer'
            }
        });

        this.backSurf.on('click', function () {
            this.container.scrollview.goToPreviousPage();
        }.bind(this))


        this.forwardMod = new Modifier({
            size: [50, 70],
            align: [1, 0.5],
            origin: [1, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.forwartSurf = new Surface({
            content: _getRaphaelRadioIcon.call(this, navForwardIcon),
            properties: {
                cursor: 'pointer'
            }
        });
        this.forwartSurf.on('click', function () {
            this.container.scrollview.goToNextPage();
        }.bind(this))

        this.rootNode.add(this.forwardMod).add(this.forwartSurf);
        this.rootNode.add(this.backMod).add(this.backSurf);
    }

    function _scrollRadio() {
        var bgLight = window.sv.scheme.textWhite;
        var bgDark = window.sv.scheme.lightGrey;
        this.container = new ScrollContainer();
        var surfaces = [];
        this.container.scrollview.setOptions({
            direction: 0
        })
        this.container.scrollview.sequenceFrom(surfaces);

        var n = 1;

        for (var i = 4; i < 30; i += 7) {
            var programSurface = new RadioProgram({
                mp3: '01' + i + '.mp3',
                bg: n % 2 === 0 ? bgLight : bgDark
            });
            n++;
            programSurface.pipe(this.container.scrollview);
            programSurface.pipe(this._eventOutput);
            surfaces.push(programSurface);
        }


        this.rootNode.add(this.container);
        this.container.scrollview.goToPage(4);
    }


    RadioScrollDesk.prototype = Object.create(View.prototype);
    RadioScrollDesk.prototype.constructor = RadioScrollDesk;

    RadioScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = RadioScrollDesk;
});
