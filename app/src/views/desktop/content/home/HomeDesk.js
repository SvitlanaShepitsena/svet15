/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HomeSection = require('dviews/content/home/HomeSectionDesk');
    var MapsCell = require('dviews/content/home/MapsDesk');

    var flipDailyNews = require('text!cviews/content/home/jade/flipDailyNews.html');
    var flipWeeklyNews = require('text!cviews/content/home/jade/flipWeeklyNews.html');
    var flipYellowPages = require('text!cviews/content/home/jade/flipYellowPages.html');
    var flipRadioProgram = require('text!cviews/content/home/jade/flipRadioProgram.html');

    function HomeDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _flex.call(this);
        //_gridParts.call(this);
        _homeMoto.call(this);

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


        _content.call(this);
    }

    function _content() {

    }

    function _homeMoto() {
        this.motoModifier = new Modifier({
            opacity: 0.85,
            size: [undefined, window.innerHeight - window.sv.sizing.headerHeight],
            transform: Transform.translate(0, window.sv.sizing.headerHeight, 0)
        });

        this.bgMotoSurface = new Surface({
            properties: {
                backgroundColor: '#3D566E'
            }
        });

        this.motoTextModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity:1,

            transform: Transform.translate(0, window.sv.sizing.headerHeight, 0)
        });

        this.motoTextSurface = new Surface({
            content: '<h1>We Make Your Business<br/>Known to Community</h1>',
            classes: [],
            properties: {
                color: 'Orange',
                textAlign: 'center',
                zIndex:1

            }
        });

        this.bgMotoSurface = new Surface({
            content: '',
            classes: [],
            properties: {
                color: 'Orange',
                textAlign: 'center',
                backgroundColor: '#3D566E'
            }
        });

        this.bgMotoSurface.pipe(this._eventOutput);
        this.motoTextSurface.pipe(this._eventOutput);
        this.rootNode.add(this.motoModifier).add(this.bgMotoSurface);
        this.rootNode.add(this.motoTextModifier).add(this.motoTextSurface);
    }

    HomeDesk.prototype = Object.create(View.prototype);
    HomeDesk.prototype.constructor = HomeDesk;

    HomeDesk.DEFAULT_OPTIONS = {
        center: [0.5, 0.5],
        height: window.innerHeight,
        width: window.innerWidth,
        fromRight: 1,
        fromLeft: -1,
        color: 'white',
        contProp: {
            backgroundColor: '#FFF2DF'
        },
        sectionProp: {
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '5px',
            textAlign: "center"
        }
    };

    function _flex() {
        this.flexMod = new Modifier({
            align: this.options.center,
            origin: this.options.center
        });
        this.layout = new FlexibleLayout({
            ratios: [4, 1, 1],
            direction: 1
        });
        this.maps = new MapsCell();

        this.flexContent = [];
        this.flexContent.push(this.maps);
        this.layout.sequenceFrom(this.flexContent);
        this.rootNode.add(this.flexMod).add(this.maps);
    }

    function _gridParts() {

        this.topLeftSection = new HomeSection({
            sign: this.options.fromLeft,
            period: '900',
            dampingRatio: 0.3,
            icon: 'news-daily',
            content: '<h4 class="icon-text">Svet</br>Daily Newspaper</h4>',
            flipInfo: flipDailyNews
        })

        this.topRightSection = new HomeSection({
            sign: this.options.fromRight,
            period: '1000',
            dampingRatio: 0.3,
            icon: 'weekly',
            content: '<h4 class="icon-text">Saturday Plus</br>Weekly Newspaper</h4>',
            flipInfo: flipWeeklyNews
        })
        this.bottomLeftSection = new HomeSection({
            sign: this.options.fromLeft,
            period: '1100',
            dampingRatio: 0.3,
            icon: 'yp',
            content: '<h4 class="icon-text"> Russian-American</br>Yellow Pages' +
            '</h4>',
            flipInfo: flipYellowPages

        })
        this.bottomRightSection = new HomeSection({
            sign: this.options.fromRight,
            period: '800',
            dampingRatio: 0.3,
            icon: 'radio',
            content: '<h4 class="icon-text"> Radio-Program</br>"OSA"</h4>',
            flipInfo: flipRadioProgram
        })

        this.topLeftSection.pipe(this._eventOutput);
        this.topRightSection.pipe(this._eventOutput);
        this.bottomLeftSection.pipe(this._eventOutput);
        this.bottomRightSection.pipe(this._eventOutput);

        this.contentTop = [];
        this.contentTop.push(this.topLeftSection);
        this.contentTop.push(this.topRightSection);
        this.gridContentTop = new GridLayout({dimensions: [2, 1]});
        this.gridContentTop.sequenceFrom(this.contentTop);

        this.contentBottom = [];
        this.contentBottom.push(this.bottomLeftSection);
        this.contentBottom.push(this.bottomRightSection);
        this.gridContentBottom = new GridLayout({dimensions: [2, 1]});
        this.gridContentBottom.sequenceFrom(this.contentBottom);

        this.flexContent.push(this.gridContentTop);
        this.flexContent.push(this.gridContentBottom);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [undefined, undefined],
            align: this.options.center,
            origin: this.options.center
        });
        this.rootNode = this.add(this.centerModifier);
    }

    module.exports = HomeDesk;
});
