/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');


    function HomePageView() {
        View.apply(this, arguments);

        _init.call(this);

        _flex.call(this);

    }

    var bdr = '2px inset #F4B6AB';

    function _flex() {
        this.flexMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.layout = new FlexibleLayout({
            ratios: [2, 1, 1, 1, 1],
            direction: 1
        });

        this.flexContent = [];

        this.fSurface1 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });


        this.fSurface2 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });


        this.fSurface3 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });


        this.fSurface4 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });


        this.fSurface5 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });
        this.fSurface1.pipe(this._eventOutput);
        this.fSurface2.pipe(this._eventOutput);
        this.fSurface3.pipe(this._eventOutput);
        this.fSurface4.pipe(this._eventOutput);
        this.fSurface5.pipe(this._eventOutput);

        this.flexContent.push(this.fSurface1);
        this.flexContent.push(this.fSurface2);
        this.flexContent.push(this.fSurface3);
        this.flexContent.push(this.fSurface4);
        this.flexContent.push(this.fSurface5);

        this.layout.sequenceFrom(this.flexContent);

        this.rootNode.add(this.flexMod).add(this.layout);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    HomePageView.prototype = Object.create(View.prototype);
    HomePageView.prototype.constructor = HomePageView;

    HomePageView.DEFAULT_OPTIONS = {};

    module.exports = HomePageView;
});
