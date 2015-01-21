define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function LogoDesk() {
        View.apply(this, arguments);
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        _rmgText.call(this);
        _svetText.call(this);
        _logoSvg.call(this);
    }

    function _logoSvg() {
        var paper = Raphael(10, 50, 320, 200);
        // Creates circle at x = 50, y = 40, with radius 10
        var circle = paper.circle(50, 40, 10);
// Sets the fill attribute of the circle to red (#f00)
        circle.attr("fill", "#f00");

// Sets the stroke attribute of the circle to white
        circle.attr("stroke", "#fff");
        this.logoSvgMod = new Modifier({
            size: [undefined, undefined],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.logoSvgSurf = new Surface({
            size: [undefined, undefined],
            content: 'paper.circle',
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
            size: [undefined, 30],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.svetTextSurf = new Surface({
            size: [undefined, undefined],
            content: 'SVET',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });
        this.rootNode.add(this.svetTextMod).add(this.svetTextSurf);
    }

    function _rmgText() {
        this.mediaSurface = new Surface({
            size: [undefined, 50],
            content: 'Russian Media Group',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });

        var imageSurface = new ImageSurface();
        imageSurface.setContent('img/logo.png');
        //this.svgSurface = new Surface({
        //    size: [undefined, undefined],
        //    content: mysvg
        //});
        this.rootNode.add(this.mediaSurface);
    }

    LogoDesk.prototype = Object.create(View.prototype);
    LogoDesk.prototype.constructor = LogoDesk;

    LogoDesk.DEFAULT_OPTIONS = {};

    module.exports = LogoDesk;
});
