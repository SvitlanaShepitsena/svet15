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

        var paper = Raphael(div, 580, 200);
        var path = drawpath(paper, "M80,80 L20,80 L130,10 L240,80 L180,80", 2000, {
            fill: 'none',
            stroke: 'red',
            'stroke-width': 11,
            'fill-opacity': 0
        }, function () {
            //path.animate( { fill: 'gray', stroke: 'black', 'fill-opacity': 1 }, 5000, function()
            //{
            //    this.animate( { fill: 'blue', stroke: 'black', 'fill-opacity': 0.5 }, 5000 );
            //} );
        });
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

    function _svetText() {
        this.svetTextMod = new Modifier({
            size: [undefined, undefined],
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
            size: [undefined, undefined],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 40, 0)
        });
        this.mediaSurface = new Surface({
            size: [undefined, undefined],
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
            size: [300, undefined],
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
