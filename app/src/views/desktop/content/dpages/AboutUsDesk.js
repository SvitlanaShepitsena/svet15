define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var aboutDesk = require('text!dviews/jade/about/aboutUsPage.html');
    var aboutDesk2 = require('text!dviews/jade/about/about-desk.html');
    function AboutUsDesk() {
        View.apply(this, arguments);
        this.contentHeight = window.innerWidth / 2;

        this.centerModifier = new Modifier({
            size: [undefined, undefined],
            align: [0.5, 0.5],
            opacity: 0.9,
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });

        this.surfaceBg = new ImageSurface({
            size: [undefined, window.innerHeight],
            content: '',
            properties:{
                backgroundColor: '#174C70'
            }
        });

        this.surfaceBg.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surfaceBg);
        _addContent.call(this);
        _addContent2.call(this);
    }

    function _getRaphaelIcon(text) {
        var divText = document.createElement('div');
        var paper = Raphael(divText, 500, 500);
        var element = paper.text(10, 10, text).attr({fill: 'white', stroke: 'none', 'font-size': 25});
        //element.transform('t33 43, s0');
        //this.iconElements.push(element);
        return divText;
    }

    function _addContent() {


        this.whoMod = new Modifier({
            align: [0.3, 0.35],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.whoSurf = new Surface({
            size: [window.innerWidth / 4, window.innerHeight / 2],
            content: aboutDesk,
            properties: {
                fontSize: "20px",
                lineHeight: '1.3em',
                fontFamily: "Open Sans Condensed",
                float: 'left',
                textAlign: 'justify',
                color: window.sv.scheme.textWhite
            }
        });
        this.whoSurf.pipe(this._eventOutput);
        this.rootNode.add(this.whoMod).add(this.whoSurf);

    }

    function _addContent2() {


        this.whoMod2 = new Modifier({
            align: [0.7, 0.35],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.whoSurf2 = new Surface({
            size: [window.innerWidth / 4, window.innerHeight / 2],
            content: aboutDesk2,
            properties: {
                fontSize: "20px",
                lineHeight: '1.3em',
                fontFamily: "Open Sans Condensed",
                float: 'left',
                textAlign: 'justify',
                color: window.sv.scheme.textWhite
            }
        });
        this.whoSurf2.pipe(this._eventOutput);
        this.rootNode.add(this.whoMod2).add(this.whoSurf2);

    }


    ;

    AboutUsDesk.prototype = Object.create(View.prototype);
    AboutUsDesk.prototype.constructor = AboutUsDesk;


    AboutUsDesk.DEFAULT_OPTIONS = {};

    module.exports = AboutUsDesk;
});
