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
            content: "<img class='img-logo-mob' src='../../../../img/home-page/svet-logo-mob.png'>" +
            " <p class='p-svet'><span class='em-svet'>SVET Media Group</span> is the Midwest’s first and oldest publishing and advertising company serving the Russian, Ukrainian and Lithuanian communities since 1990.</p>",
            properties: {
                padding: '10px',
                backgroundColor: '#FFF2DF',
                borderBottom: bdr,
                textAlign: "center"
            }
        });
        this.fSurface2 = new Surface({
            size: [undefined, undefined],
            content: "<ul class='list-inline'>" +
            "<li class='li-img'>" +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/news-daily-or.png'>" +
            "</li>" +
            "<li class='li-text'>" +
            "<h4>SVET Daily Newspaper</h4>" +
            "<p>Over 48 pages. It is the most up-to-date Russian language newspaper in USA.</p></li>" +
            "</ul>",
            properties: this.options.sectionProp
        });


        this.fSurface3 = new Surface({
            size: [undefined, undefined],
            content: "<ul class='list-inline'>" +
            "<li class='li-img'>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/news-weekly-or.png'>" +
            '</div>' +
            "</li>" +
            "<li class='li-text'>" +
            "<h4>Saturday Plus Weekly Newspaper</h4>" +
            "<p>Free Paper with over 48 pages weekly. It covers entertainment and other social news in Unites States and abroad.</p></li>" +
            "</ul>",
            properties: this.options.sectionProp
        });


        this.fSurface4 = new Surface({
            size: [undefined, undefined],
            content: "<ul class='list-inline'>" +
            "<li class='li-img'>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/yp-or.png'>" +
            '</div>' +
            "</li>" +
            "<li class='li-text'>" +
            "<h4>Russian-American Yellow Pages</h4>" +
            "<p>The Russian YP present over 650 full color pages of services and products to the Russian-speaking community in the Chicagoland area.</p></li>" +
            "</ul>",
            properties: this.options.sectionProp
        });


        this.fSurface5 = new Surface({
            size: [undefined, undefined],
            content: "<ul class='list-inline'>" +
            "<li class='li-img'>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/radio-or.png'>" +
            '</div>' +
            "</li>" +
            "<li class='li-text'>" +
            "<h4>Radio Program “OSA”</h4>" +
            "<p>Every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m. listen to Radio OSA programs.</p></li>" +
            "</ul>",
            properties: this.options.sectionProp
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
        sectionProp: {
            backgroundColor: '#FFF2DF',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '5px',
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
