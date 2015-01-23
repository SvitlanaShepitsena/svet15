/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HomeSectionDesk = require('dviews/content/home/HomeSectionDesk');

    var dailyNews = require('text!dviews/content/home/jade/dailyNews.html');
    var weeklyNews = require('text!dviews/content/home/jade/weeklyNews.html');
    var yellowPages = require('text!dviews/content/home/jade/yellowPages.html');
    var radioProgram = require('text!dviews/content/home/jade/radioProgram.html');

    function HomeContentDesk() {
        View.apply(this, arguments);

        this.on('parts:info', function (data) {
            switch (data.icon) {
                case 'hideAll':
                    this.maps.hideEverything();
                    break;
                case 'news-daily':
                case 'weekly':
                    this.maps.showSvetPoints();
                    break;
                case 'yp':
                    this.maps.showYpCompanies();
                    break;
                case 'radio':
                    break;
            }
        }.bind(this));

        _init.call(this);
        _flex.call(this);
        _homeMoto.call(this);
        _gridParts.call(this);
    }

    HomeContentDesk.prototype = Object.create(View.prototype);
    HomeContentDesk.prototype.constructor = HomeContentDesk;

    HomeContentDesk.DEFAULT_OPTIONS = {
        center: [0.5, 0.5],
        height: window.innerHeight,
        width: window.innerWidth,
        color: 'white',
        motoOpts: {
            fontSize: '42px',
            lineHeight: '50px',
            color: 'Orange',
            textAlign: 'center',
            zIndex: 1
        }
    };

    function _init() {
        this.contentMod = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            size: [window.sv.sizing.contentWidth, window.sv.sizing.contentWidth - window.sv.sizing.headerHeight]
        });
        this.rootNode = this.add(this.contentMod);
    }

    function _homeMoto() {
        this.motoTextMod = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            size: [window.sv.sizing.contentWidth, true],
            opacity: 1,
            transform: Transform.translate(0, window.sv.sizing.headerHeight * 1.2, 0)
        });
        this.motoTextSurf = new Surface({
            content: '<p>WE MAKE YOUR BUSINESS<br/>KNOWN TO COMMUNITY</p>',
            properties: this.options.motoOpts
        });

        this.rootNode.add(this.motoTextMod).add(this.motoTextSurf);
    }


    function _flex() {
        this.flexMod = new Modifier({
            align: this.options.center,
            transform: Transform.translate(0, window.sv.sizing.headerHeight, 0),
            zIndex: 10,
            origin: this.options.center
        });
        this.layout = new FlexibleLayout({
            ratios: [1, 1],
            direction: 1
        });
        this.flex1surf = new Surface({
            size: [window.sv.sizing.contentWidth, 50],
            content: 'Hello, World!',
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'red'

            }
        });
        this.flexContent = [];
        this.flexContent.push(this.flex1surf);
        this.layout.sequenceFrom(this.flexContent);
        this.rootNode.add(this.flexMod).add(this.layout);
    }

    function _gridParts() {

        this.dailyNews = new HomeSectionDesk({
            icon: 'news-daily',
            content: dailyNews
        })

        this.weeklyNews = new HomeSectionDesk({
            icon: 'weekly',
            content: weeklyNews
        })
        this.yp = new HomeSectionDesk({
            icon: 'yp',
            content: yellowPages
        })
        this.radioProgram = new HomeSectionDesk({
            icon: 'radio',
            content: radioProgram
        })

        this.dailyNews.pipe(this._eventOutput);
        this.weeklyNews.pipe(this._eventOutput);
        this.yp.pipe(this._eventOutput);
        this.radioProgram.pipe(this._eventOutput);

        this.contentTop = [];
        this.contentTop.push(this.dailyNews);
        this.contentTop.push(this.weeklyNews);
        this.contentTop.push(this.yp);
        this.contentTop.push(this.radioProgram);
        this.gridContentTop = new GridLayout({dimensions: [4, 1]});
        this.gridContentTop.sequenceFrom(this.contentTop);


        this.flexContent.push(this.gridContentTop);
    }


    module.exports = HomeContentDesk;
});
