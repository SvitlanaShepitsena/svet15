define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function LogoDesk() {
        View.apply(this, arguments);
        _init.call(this);
        _svetText.call(this);
        _rmgText.call(this);
        _logoSvg.call(this);
    }

    function _logoSvg() {

        var div = document.createElement('div');

        var paper = Raphael(div, 256, 100);
        var line2 = paper.path("M5 50");
        var line3 = paper.path("M125 10");
        var line4 = paper.path("M246 50");

        var line = paper.path("M50 50").animate({path: "M50 50 L 5 50"}, 500, function () {
            line2.animate({path: "M5 50 L125 10"}, 500, function () {
                line3.animate({path: "M125 10 L246 50"}, 500, function () {
                    line4.animate({path: "M246 50 L200 50"}, 500, function () {
                    })
                })
            });
        });
        line.attr("stroke", "red");
        line.attr("stroke-width", "5px");

        line2.attr("stroke", "red");
        line2.attr("stroke-width", "5px");

        line3.attr("stroke", "red");
        line3.attr("stroke-width", "5px");

        line4.attr("stroke", "red");
        line4.attr("stroke-width", "5px");

        this.logoSvgMod = new Modifier({
            size: [undefined, undefined],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.logoSvgSurf = new Surface({
            size: [undefined, undefined],
            content: div,
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.logoSvgMod).add(this.logoSvgSurf);

    }

    function _svetText() {
        this.svetTextMod = new Modifier({
            size: [undefined, 100],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 20, 0)
        });
        this.svetTextSurf = new Surface({
            size: [undefined, undefined],
            content: 'SVET',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.svetTextMod).add(this.svetTextSurf);
    }

    function _rmgText() {

        this.mediaSurfMod = new Modifier({
            size: [undefined, 100],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 40, 0)
        });
        this.mediaSurface = new Surface({
            size: [undefined, 100],
            content: 'Russian Media Group',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center'
            }
        });


        this.rootNode.add(this.mediaSurfMod).add(this.mediaSurface);
    }

    function _init() {
        this.bg = new Surface({
            size: [undefined, undefined],
            content: '',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'blueviolet'
            }
        });
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.bg);
    }


    LogoDesk.prototype = Object.create(View.prototype);
    LogoDesk.prototype.constructor = LogoDesk;

    LogoDesk.DEFAULT_OPTIONS = {};

    module.exports = LogoDesk;
});
