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

    HomeContentDesk.DEFAULT_OPTIONS = {
        color: 'white',
        motoOpts: {
            color: 'red',
            textAlign: 'center',
            zIndex: 1
        }
    };

    HomeContentDesk.prototype = Object.create(View.prototype);
    HomeContentDesk.prototype.constructor = HomeContentDesk;

    HomeContentDesk.prototype.contentInit = function () {
        this.opacityMotoTrans.halt();
        this.opacityMotoTrans.set(1, {duration: 500});
    };

    HomeContentDesk.prototype.contentShort = function () {
        this.opacityMotoTrans.halt();
        this.opacityMotoTrans.set(0, {duration: 500});
        this.gridTrans.set(sv.sizing.headerHeightShift, {duration: 500, curve: "easeOut"});
    };

    function _init() {
        this.contentMod = new Modifier({
            size: [undefined, undefined],
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.rootNode = this.add(this.contentMod);

        this.flexContent = [];
        var ratios = [10, true, 2];

        this.flexibleLayout = new FlexibleLayout({
            ratios: window.innerHeight < 960 ? ratios : [10, 20, true],
            direction: 1
        });

        this.flexibleLayout.sequenceFrom(this.flexContent);
        this.rootNode.add(this.flexibleLayout);
    }

    function _homeMoto() {
        this.motoRenderNode = new RenderNode();

        this.opacityMotoTrans = new Transitionable(1);
        this.motoTextMod = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.opacityMotoTrans.get()
            }.bind(this),
            transform: Transform.translate(0, window.sv.sizing.headerHeight, 0)
        });


        var div = document.createElement('div');
        //div.style.cssText = 'position:relative;';
        var paper = Raphael(div, 575, 150);
        var st = paper.set();
        var t = paper.text(280, 40, 'WE MAKE YOUR BUSINESS');
        var t2 = paper.text(285, 70, 'KNOWN TO COMMUNITY');
        st.push(t);
        st.push(t2);

        st.attr({
            stroke: 'none',
            fill: window.sv.scheme.textYellow,
            'font-size': '40px',
            'font-weight': 'bold',
            'font-family': "Myriad Pro"
        });

        this.motoTextSurf = new Surface({
            content: div,
            properties: this.options.motoOpts
        });
        this.motoTextSurf.pipe(this._eventOutput);
        this.motoRenderNode.add(this.motoTextMod).add(this.motoTextSurf);
        this.flexContent.push(this.motoRenderNode);
    }

    function _gridParts() {
        this.gridRenderNode = new RenderNode();
        this.gridTrans = new Transitionable(140);
        this.gridMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            size: [window.innerWidth-100, window.innerHeight/1.5],
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
        this.gridContentTop = new GridLayout(
            {
                dimensions: [4, 1],
                gutterSize: [8, 10],
                transition: {duration: 1000, curve: "easeInOut"}
            }
        );
        this.gridContentTop.sequenceFrom(this.homeSectionsContainse);


        this.gridRenderNode.add(this.gridMod).add(this.gridContentTop);
        this.flexContent.push(this.gridRenderNode);
        this.emptySurface = new Surface({
            size: [undefined, window.innerHeight - 960],
            content: ''
        });
        this.flexContent.push(this.emptySurface);
    }


    module.exports = HomeContentDesk;
});
