/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

    var HomePart = require('cviews/content/home/HomePart');
    var MapsCell = require('cviews/content/home/MapsCell');

    var grid11 = require('text!cviews/content/home/jade/grid11.html');
    var grid12 = require('text!cviews/content/home/jade/grid12.html');
    var grid21 = require('text!cviews/content/home/jade/grid21.html');
    var grid22 = require('text!cviews/content/home/jade/grid22.html');

    function HomeCell() {
        View.apply(this, arguments);

        _init.call(this);
        _flex.call(this);
        _gridParts.call(this);

        this.on('parts:info', function (data) {
            switch (data.icon) {

                case 'news-daily':
                    this.maps.showSvetPoints();
                    break;

                case 'weekly':

                    break;

                case 'yp':

                    break;

                case 'radio':

                    break;

            }
        })

    }

    HomeCell.prototype = Object.create(View.prototype);
    HomeCell.prototype.constructor = HomeCell;

    HomeCell.DEFAULT_OPTIONS = {
        center: [0.5, 0.5],
        height: window.innerHeight,
        width: window.innerWidth,
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
            ratios: [2, 2, 2],
            direction: 1
        });
        this.maps = new MapsCell();
        //this.maps.pipe(this._eventOutput);

        this.flexContent = [];
        this.flexContent.push(this.maps);
        this.layout.sequenceFrom(this.flexContent);
        this.rootNode.add(this.flexMod).add(this.layout);
    }

    function _gridParts() {
        this.topLeftSection = new HomePart({
            sign: -1,
            period: '900',
            dampingRatio: 0.3,
            icon: 'news-daily',
            content: '<h4 class="icon-text">Svet</br>Daily Newspaper</h4>'
        });

        this.topRightSection = new HomePart({
            sign: 1,
            period: '1000',
            dampingRatio: 0.3,
            icon: 'weekly',
            content: '<h4 class="icon-text">Saturday Plus</br>Weekly Newspaper</h4>'
        })
        this.bottomLeftSection = new HomePart({
            sign: -1,
            period: '1100',
            dampingRatio: 0.3,
            icon: 'yp',
            url: "http://www.spasibous.com/yp",
            content: '<h4>' +
            '<a class="icon-text" href="http://www.spasibous.com/yp" target="_blank">Russian-American</br>Yellow Pages</a>' +
            '</h4>'
        })
        this.bottomRightSection = new HomePart({
            sign: 1,
            period: '800',
            dampingRatio: 0.3,
            icon: 'radio',
            url: "http://media.imcpro.com/OSA/",
            content: '<h4>' +
            '<a class="icon-text" href="http://media.imcpro.com/OSA/" target="_blank">Radio-Program</br>"OSA"</a>' +
            '</h4>'
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
            align: this.options.center,
            origin: this.options.center
        });
        this.rootNode = this.add(this.centerModifier);
    }

    module.exports = HomeCell;
});
