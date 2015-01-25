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
            size: [undefined, undefined],
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.rootNode = this.add(this.contentMod);

        this.flexContent = [];
        var ratios = [1, 2];

        this.flexibleLayout = new FlexibleLayout({
            ratios: ratios,
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
        var paper = Raphael(div, 600, 150);

        var st = paper.set();
        var t = paper.text(280, 30, 'WE MAKE YOUR BUSINESS');
        var t2 = paper.text(290, 50, 'KNOWN TO COMMUNITY');
        st.push(t);
        st.push(t2);

        st.attr({
            stroke: 'none',
            fill: '#BA090C',
            'font-size': 25,
            'font-weight': 'bold',
            'line-height': '5em',
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
        this.gridTrans = new Transitionable(0);
        this.gridMod = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: function () {
                return Transform.translate(0, 140, 0);
            }.bind(this)
        });


        this.daily = new Surface({
            size: [undefined, undefined],
            content: '',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });
        this.dailyNews = new HomeSectionDesk({
            icon: 'news-daily',
            align: [0.5, 0],
            origin: [0.5, 0],
            content: dailyNews
        })

        this.weeklyNews = new HomeSectionDesk({
            align: [0.5, 0],
            origin: [0.5, 0],
            icon: 'weekly',
            content: weeklyNews
        })
        this.yp = new HomeSectionDesk({
            align: [0.5, 0],
            origin: [0.5, 0],
            icon: 'yp',
            content: yellowPages
        })
        this.radioProgram = new HomeSectionDesk({
            align: [0.5, 0],
            origin: [0.5, 0],
            icon: 'radio',
            content: radioProgram
        })

        this.dailyNews.pipe(this._eventOutput);
        this.weeklyNews.pipe(this._eventOutput);
        this.yp.pipe(this._eventOutput);
        this.radioProgram.pipe(this._eventOutput);

        this.homeSectionsContainse = [];
        this.homeSectionsContainse.push(this.daily);
        this.homeSectionsContainse.push(this.weeklyNews);
        this.homeSectionsContainse.push(this.yp);
        this.homeSectionsContainse.push(this.radioProgram);
        this.gridContentTop = new GridLayout(
            {dimensions: [4, 1],
            gutterSize:[8,10]}
        );
        this.gridContentTop.sequenceFrom(this.homeSectionsContainse);


        this.gridRenderNode.add(this.gridMod).add(this.gridContentTop);
        this.flexContent.push(this.gridRenderNode);
    }


    module.exports = HomeContentDesk;
});
