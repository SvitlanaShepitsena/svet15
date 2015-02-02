define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    var RadioProgram = require('dviews/content/radio/RadioProgram');

    function RadioScrollDesk() {
        View.apply(this, arguments);
        _init.call(this);
        _scrollRadio.call(this);
        _buttonsScroll.call(this);
    }

    function _init() {
        this.centerMod = new Modifier({
            // proportions: [.5, .25],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerMod);

    }

    function _buttonsScroll() {
        this.backMod = new Modifier({
            align: [0, 0.5],
            origin: [0, 0.7],
            transform: Transform.translate(0, 0, 0)
        });
        this.backSurf = new Surface({
            size: [100, 100],
            content: 'Back',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F',
                cursor: 'pointer'
            }
        });

        this.backSurf.on('click', function () {
            this.container.scrollview.goToPreviousPage();
        }.bind(this))


        this.forwardMod = new Modifier({
            align: [1, 0.5],
            origin: [1, 0.7],
            transform: Transform.translate(0, 0, 0)
        });
        this.forwartSurf = new Surface({
            size: [100, 100],
            content: 'Forward',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F',
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
        this.container = new ScrollContainer();
        var surfaces = [];
        this.container.scrollview.setOptions({
            direction: 0
        })
        this.container.scrollview.sequenceFrom(surfaces);


        var n = 5;

        for (var i = 0, appSurface; i < n; i++) {
            appSurface = new Surface({
                content: "Surface: " + (i + 1),
                size: [500, 350],
                properties: {
                    backgroundColor: "hsl(" + (i * 360 / n) + ", 70%, 75%)",
                    textAlign: "center"
                }
            });

            appSurface.pipe(this.container.scrollview);
            appSurface.pipe(this._eventOutput);
            surfaces.push(appSurface);
        }
        this.rootNode.add(this.container);
        this.container.scrollview.goToPage(4);
    }


    RadioScrollDesk.prototype = Object.create(View.prototype);
    RadioScrollDesk.prototype.constructor = RadioScrollDesk;

    RadioScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = RadioScrollDesk;
});
