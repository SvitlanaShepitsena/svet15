/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");
    var RenderNode = require('famous/core/RenderNode');

    var HomeSectionDesk = require('dviews/content/home/HomeSectionDesk');

    var dailyNews = require('text!dviews/content/home/jade/dailyNews.html');
    var weeklyNews = require('text!dviews/content/home/jade/weeklyNews.html');
    var yellowPages = require('text!dviews/content/home/jade/yellowPages.html');
    var radioProgram = require('text!dviews/content/home/jade/radioProgram.html');
    var Transitionable = require('famous/transitions/Transitionable');

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
        _homeMoto.call(this);
        _gridParts.call(this);
    }


    HomeContentDesk.prototype = Object.create(View.prototype);
    HomeContentDesk.prototype.constructor = HomeContentDesk;

    HomeContentDesk.prototype.contentShort = function () {
        this.opacityMotoTrans.halt();
        this.opacityMotoTrans.set(0, {duration: 500});
        this.gridTrans.set(sv.sizing.headerHeightShift, {duration: 500, curve: "easeOut"});
    }
    HomeContentDesk.prototype.contentInit = function () {
        this.opacityMotoTrans.halt();
        this.opacityMotoTrans.set(1, {duration: 500});
    }
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
            size: [window.sv.sizing.contentWidth, window.sv.sizing.contentHeight],
            align: [0.5, 0],
            origin: [0.5, 0]
        });

        this.flexContent = [];
        var ratios = [2, 1];

        this.flexibleLayout = new FlexibleLayout({
            ratios: ratios,
            direction: 1
        });

        this.flexibleLayout.sequenceFrom(this.flexContent);

        this.rootNode = this.add(this.contentMod);
        this.rootNode.add(this.flexibleLayout);
    }

    function _homeMoto() {
        this.motoRenderNode = new RenderNode();

        this.opacityMotoTrans = new Transitionable(1);
        this.motoTextMod = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            size: [window.sv.sizing.contentWidth, true],
            opacity: function () {
                return this.opacityMotoTrans.get()
            }.bind(this),
            transform: Transform.translate(0, window.sv.sizing.headerHeight * 1.2, 0)
        });
        this.motoTextSurf = new Surface({
            content: '<p>WE MAKE YOUR BUSINESS<br/>KNOWN TO COMMUNITY</p>',
            properties: this.options.motoOpts
        });

        this.motoRenderNode.add(this.motoTextMod).add(this.motoTextSurf);
        this.flexContent.push(this.motoRenderNode);
    }


    function _gridParts() {

        this.gridRenderNode = new RenderNode();
        this.gridTrans = new Transitionable(0);
        this.gridMod = new Modifier({
            size: [undefined, 0.7 * window.innerHeight],
            align: [0, 0],
            origin: [0, 0],
            transform: function () {
                return Transform.translate(0, this.gridTrans.get(), 0);
            }.bind(this)
        });
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

        this.homeSectionsContainse = [];
        this.homeSectionsContainse.push(this.dailyNews);
        this.homeSectionsContainse.push(this.weeklyNews);
        this.homeSectionsContainse.push(this.yp);
        this.homeSectionsContainse.push(this.radioProgram);
        this.gridContentTop = new GridLayout({dimensions: [4, 1]});
        this.gridContentTop.sequenceFrom(this.homeSectionsContainse);


        this.gridRenderNode.add(this.gridMod).add(this.gridContentTop);
        this.flexContent.push(this.gridRenderNode);
    }


    module.exports = HomeContentDesk;
});
