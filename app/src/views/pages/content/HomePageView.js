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

    var bdr = '2px solid #F4B6AB';

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
            content: "<img src='img/home-page/svet-logo-mob.png'>" +
            " <p class='p-svet'><span class='em-svet'>SVET Media Group</span> is the Midwest’s first and oldest publishing and advertising company serving the Russian, Ukrainian and Lithuanian communities since 1990.</p>",
            properties: {
                padding: '10px',
                lineHeight: '26px',
                backgroundColor: '#FFF2DF',
                fontSize: "16",
                borderBottom: bdr,
                textAlign: "center"
            }
        });
        this.fSurface2 = new Surface({
            size: [undefined, undefined],
            content: "<ul class='list-inline'>" +
            "<li>" +
            "<img width='20' src='img/home-page/news-daily-150.png'>" +
            "</li>" +
            "<li><p>At vero eos et accusamus et iusto odio dignissimos ducimus</p></li>" +
            "</ul>",
            properties: {
                backgroundColor: '#FFF2DF',
                display: 'inline-block',
                borderBottom: bdr,
                textAlign: "center"
            }
        });


        this.fSurface3 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                textAlign: "center"
            }
        });


        this.fSurface4 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                textAlign: "center"
            }
        });


        this.fSurface5 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: '#FFF2DF',
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

    HomePageView.DEFAULT_OPTIONS = {
        height: window.innerHeight,
        width: window.innerWidth,
        propTop: {
            padding: '10px',
            lineHeight: '26px',
            backgroundColor: '#FFF2DF',
            fontSize: "16",
            borderBottom: bdr,
            textAlign: "center"
        }
    };

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


    module.exports = HomePageView;
});
