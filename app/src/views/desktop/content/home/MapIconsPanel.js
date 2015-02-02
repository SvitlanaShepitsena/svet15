/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");

    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsDesk = require('dviews/content/home/MapsDesk');
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Slider = require('famous/widgets/Slider');
    var VideoSurface = require('famous/surfaces/VideoSurface');

    var RenderNode = require('famous/core/RenderNode');


    function MapIconsPanel() {
        View.apply(this, arguments);
        this.iconElements = [];

        _init.call(this);
        _mapIcons.call(this);

    }


    MapIconsPanel.prototype = Object.create(View.prototype);
    MapIconsPanel.prototype.constructor = MapIconsPanel;

    MapIconsPanel.prototype.animateUp = function () {
         this.gridIconTrans.halt();
        this.gridIconTrans.set(1, {duration:400, curve: "easeOutBounce"});
        var n = 0;
        var interval = setInterval(function () {
            var el = this.iconElements[n];
            n++;
            // animation in Raphael.js
            el.animate({transform: 's.7'}, 800, '>');

            if (n == 3) {
                clearInterval(interval)
            }
        }.bind(this), 800);


    }

    MapIconsPanel.prototype.animateDown = function () {

        this.gridIconTrans.halt();
        var n = 2;
        var interval = setInterval(function () {
            var el = this.iconElements[n];
            n--;
            // animation in Raphael.js
            el.animate({transform: 's0'}, 800, '>', function () {
                if (n < 0) {
                    this.gridIconTrans.set(0, {duration:1000, curve: "easeOutBounce"});
                }
            }.bind(this));

            if (n < 0) {
                clearInterval(interval)
            }
        }.bind(this), 800);


    }

    MapIconsPanel.DEFAULT_OPTIONS = {
        iconsPanelSize: [90, 40],
        iconsGridSize: [100, 40],
        mapIconProps: {
            cursor: 'pointer'
        }
    };

    function _init() {
        this.centerModifier = new Modifier({
            size: this.options.iconsPanelSize,
            opacity: function () {
                return this.gridIconTrans.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)

        });

        this.rootNode = this.add(this.centerModifier);
    }


    /** =Map Svet Icons
     */

    /*Raphael Icon Design*/

    function _getRaphaelIcon(file) {
        var divDaily = document.createElement('div');
        var paper = Raphael(divDaily, 50, 50);
        var element = paper.path(file).attr({fill: '#797979', stroke: 'none'});
        element.transform('t33 43, s0');
        this.iconElements.push(element);
        return divDaily;
    }

    function _mapIcons() {

        /*Map Icons Panel*/
        this.mapIconsBg = new Surface({
            properties: {
                border: '1px',
                borderStyle: 'solid',
                borderColor: '#999999',
                color: 'white',
                backgroundColor: 'floralwhite'
            }
        });

        this.rootNode.add(this.mapIconsBg);

        /*Grid Layout for Map Icons*/
        this.gridIconTrans = new Transitionable(0);

        this.gridIconsMod = new Modifier({
            size: this.options.iconsGridSize,
            align: [0.6, 0.6],
            origin: [0.5, 0.5],

            opacity: function () {
                return this.gridIconTrans.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });

        this.gridLayout = new GridLayout({
            dimensions: [4, 1],
            gutterSize:[2,2]
        });
        this.surfaces = [];
        this.gridLayout.sequenceFrom(this.surfaces);

        var dailySvg = 'M23.024,5.673c-1.744-1.694-3.625-3.051-5.168-3.236c-0.084-0.012-0.171-0.019-0.263-0.021H7.438c-0.162,0-0.322,0.063-0.436,0.18C6.889,2.71,6.822,2.87,6.822,3.033v25.75c0,0.162,0.063,0.317,0.18,0.435c0.117,0.116,0.271,0.179,0.436,0.179h18.364c0.162,0,0.317-0.062,0.434-0.179c0.117-0.117,0.182-0.272,0.182-0.435V11.648C26.382,9.659,24.824,7.49,23.024,5.673zM25.184,28.164H8.052V3.646h9.542v0.002c0.416-0.025,0.775,0.386,1.05,1.326c0.25,0.895,0.313,2.062,0.312,2.871c0.002,0.593-0.027,0.991-0.027,0.991l-0.049,0.652l0.656,0.007c0.003,0,1.516,0.018,3,0.355c1.426,0.308,2.541,0.922,2.645,1.617c0.004,0.062,0.005,0.124,0.004,0.182V28.164z'
        this.dailyNewsIcon = new Surface({
            properties: this.options.mapIconProps,
            content: _getRaphaelIcon.call(this, dailySvg)
        });

        var weeklySvg = 'M28.625,26.75h-26.5V8.375h1.124c1.751,0,0.748-3.125,3-3.125c3.215,0,1.912,0,5.126,0c2.251,0,1.251,3.125,3.001,3.125h14.25V26.75z';
        this.weeklyNewsIcon = new Surface({
            properties: this.options.mapIconProps,
            content: _getRaphaelIcon.call(this, weeklySvg)
        });

        var yPSvg = 'M25.754,4.626c-0.233-0.161-0.536-0.198-0.802-0.097L12.16,9.409c-0.557,0.213-1.253,0.316-1.968,0.316c-0.997,0.002-2.029-0.202-2.747-0.48C7.188,9.148,6.972,9.04,6.821,8.943c0.056-0.024,0.12-0.05,0.193-0.075L18.648,4.43l1.733,0.654V3.172c0-0.284-0.14-0.554-0.374-0.714c-0.233-0.161-0.538-0.198-0.802-0.097L6.414,7.241c-0.395,0.142-0.732,0.312-1.02,0.564C5.111,8.049,4.868,8.45,4.872,8.896c0,0.012,0.004,0.031,0.004,0.031v17.186c0,0.008-0.003,0.015-0.003,0.021c0,0.006,0.003,0.01,0.003,0.016v0.017h0.002c0.028,0.601,0.371,0.983,0.699,1.255c1.034,0.803,2.769,1.252,4.614,1.274c0.874,0,1.761-0.116,2.583-0.427l12.796-4.881c0.337-0.128,0.558-0.448,0.558-0.809V5.341C26.128,5.057,25.988,4.787,25.754,4.626zM5.672,11.736c0.035,0.086,0.064,0.176,0.069,0.273l0.004,0.054c0.016,0.264,0.13,0.406,0.363,0.611c0.783,0.626,2.382,1.08,4.083,1.093c0.669,0,1.326-0.083,1.931-0.264v1.791c-0.647,0.143-1.301,0.206-1.942,0.206c-1.674-0.026-3.266-0.353-4.509-1.053V11.736zM10.181,24.588c-1.674-0.028-3.266-0.354-4.508-1.055v-2.712c0.035,0.086,0.065,0.176,0.07,0.275l0.002,0.053c0.018,0.267,0.13,0.408,0.364,0.613c0.783,0.625,2.381,1.079,4.083,1.091c0.67,0,1.327-0.082,1.932-0.262v1.789C11.476,24.525,10.821,24.588,10.181,24.588z';
        this.yPIcon = new Surface({
            properties: this.options.mapIconProps,
            content: _getRaphaelIcon.call(this, yPSvg)
        });
        //
        //var radioSvg = 'M4.135,16.762c3.078,0,5.972,1.205,8.146,3.391c2.179,2.187,3.377,5.101,3.377,8.202h4.745c0-9.008-7.299-16.335-16.269-16.335V16.762zM4.141,8.354c10.973,0,19.898,8.975,19.898,20.006h4.743c0-13.646-11.054-24.749-24.642-24.749V8.354zM10.701,25.045c0,1.815-1.471,3.287-3.285,3.287s-3.285-1.472-3.285-3.287c0-1.813,1.471-3.285,3.285-3.285S10.701,23.231,10.701,25.045z';
        //this.radioIcon = new Surface({
        //    properties: this.options.mapIconProps,
        //    content: _getRaphaelIcon.call(this, radioSvg)
        //});

        this.dailyNewsIcon.on('click', function () {
            this._eventOutput.emit('show:svetPoints')
        }.bind(this))

        this.weeklyNewsIcon.on('click', function () {
            this._eventOutput.emit('show:svetPoints')
        }.bind(this))

        this.yPIcon.on('click', function () {
            this._eventOutput.emit('show:ypCompanies')
        }.bind(this))

        this.weeklyNewsIcon.on('click', function () {
            //this.mapDesk.showSvetPoints()
        }.bind(this))

        this.surfaces.push(this.dailyNewsIcon);
        this.surfaces.push(this.weeklyNewsIcon);
        this.surfaces.push(this.yPIcon);
        this.surfaces.push(this.radioIcon);
        this.rootNode.add(this.gridIconsMod).add(this.gridLayout);
    }

    module.exports = MapIconsPanel;
});
