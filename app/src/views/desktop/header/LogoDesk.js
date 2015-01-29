define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');

    function LogoDesk() {
        this.fullPosition = window.sv.sizing.headerHeight * .09;
        this.shortPosition = -window.sv.sizing.headerHeight * 0.36;
        this.shiftTransitionable = new Transitionable(this.fullPosition);
        this.opacityTransitionable = new Transitionable(1);

        this.red = new Transitionable(255);
        this.green = new Transitionable(255);
        this.blue = new Transitionable(255);

        View.apply(this, arguments);
        _init.call(this);
        _svetSvg.call(this);
        //_rmgText.call(this);
        _logoSvg.call(this);
    }

    LogoDesk.prototype = Object.create(View.prototype);
    LogoDesk.prototype.constructor = LogoDesk;

    LogoDesk.DEFAULT_OPTIONS = {
        logoHeight: window.sv.sizing.headerHeight * .82,
        paperWidth: window.sv.sizing.logoContainerWidth * .87
    };

    function _init() {
        this.centerModifier = new Modifier({
            transform: function () {
                return Transform.translate(0, 40, 0);
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    function _logoSvg() {
        var div = document.createElement('div');
        var paper = Raphael(div, window.innerWidth, this.options.logoHeight);
        var path = drawpath(paper, "M80,80 L20,80 L130,10 L240,80 L180,80", 2000, {
            fill: 'none',
            stroke: 'red',
            'stroke-width': 11,
            'fill-opacity': 0
        });
        var text = paper.text(129, 56, 'RUSSIAN MEDIA GROUP');
        text.attr({
            stroke: 'none',
            fill: 'white',
            'font-size': 22,
            'line-height': '5em',
            'font-family': "Myriad Pro"
        })
        var shift = window.innerWidth > 1160 ? 0 : (window.innerWidth - 1160) / 5;
        this.svgLine = new Transitionable(shift);
        this.logoSvgMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityTransitionable.get();
            }.bind(this),
            transform: function () {
                shift = window.innerWidth > 1160 ? 84 : 10;
                this.svgLine.halt();
                this.svgLine.set(shift, {duration: 50});
                return Transform.translate(this.svgLine.get(), -70, 0);
            }.bind(this)
        });
        this.logoSvgSurf = new Surface({
            content: div,
            properties: {
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.logoSvgMod).add(this.logoSvgSurf);
    }

    function _svetSvg() {
        var div = document.createElement('div');
        var paper = Raphael(div, window.innerWidth, this.options.logoHeight);
        var text = paper.text(129, 45, 'SVET');
        text.attr({
            stroke: 'none',
            fill: 'white',
            'font-size': 32,
            'font-weight': 'bold',
            'line-height': '5em',
            'font-family': "Myriad Pro"
        })
        var shift = window.innerWidth > 1160 ? 0 : (window.innerWidth - 1160) / 5;
        this.svetSvgMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: function () {
                shift = window.innerWidth > 1160 ? 84 : 10;
                this.svgLine.halt();
                this.svgLine.set(shift, {duration: 50});
                return Transform.translate(this.svgLine.get(), -70, 0);
            }.bind(this)
        });
        this.svetSvgSurf = new Surface({
            content: div,
            properties: {
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.svetSvgMod).add(this.svetSvgSurf);
    }


    LogoDesk.prototype.increaseLogo = function () {
        var currentPosition = this.shiftTransitionable.get();
        if (currentPosition !== this.fullPosition) {
            this.shiftTransitionable.halt();
            this.opacityTransitionable.halt();
            this.shiftTransitionable.set(this.fullPosition, {duration: 500, curve: "linear"});
            this.opacityTransitionable.set(1, {duration: 500, curve: "linear"});
            this.changeColorHigh.call(this);
        }
    }

    LogoDesk.prototype.decreaseLogo = function () {
        var currentPosition = this.shiftTransitionable.get();
        if (currentPosition !== this.shortPosition) {
            this.shiftTransitionable.halt();
            this.opacityTransitionable.halt();

            this.shiftTransitionable.set(this.shortPosition, {duration: 500, curve: "linear"});
            this.opacityTransitionable.set(0, {duration: 500, curve: "linear"});

            this.changeColorShort.call(this);
        }
    }

    LogoDesk.prototype.changeColorHigh = function () {
        this.red.halt();
        this.green.halt();
        this.blue.halt();

        this.red.set(255, {duration: 500, curve: "linear"});
        this.green.set(255, {duration: 500, curve: "linear"});
        this.blue.set(255, {duration: 500, curve: "linear"});

    }

    LogoDesk.prototype.changeColorShort = function () {
        this.red.halt();
        this.green.halt();
        this.blue.halt();

        this.red.set(250, {duration: 500, curve: "linear"});
        this.green.set(250, {duration: 500, curve: "linear"});
        this.blue.set(210, {duration: 500, curve: "linear"});
    }

    function drawpath(canvas, pathstr, duration, attr, callback) {
        var guide_path = canvas.path(pathstr).attr({stroke: "none", fill: "none"});
        var path = canvas.path(guide_path.getSubpath(0, 1)).attr(attr);
        var total_length = guide_path.getTotalLength(guide_path);
        var last_point = guide_path.getPointAtLength(0);
        var start_time = new Date().getTime();
        var interval_length = 50;
        var result = path;
        var interval_id = setInterval(function () {
            var elapsed_time = new Date().getTime() - start_time;
            var this_length = elapsed_time / duration * total_length;
            var subpathstr = guide_path.getSubpath(0, this_length);
            attr.path = subpathstr;
            path.animate(attr, interval_length);
            if (elapsed_time >= duration) {
                clearInterval(interval_id);
                if (callback != undefined) callback();
                guide_path.remove();
            }
        }, interval_length);
        return result;
    }


    module.exports = LogoDesk;
});
