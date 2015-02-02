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
        var n = 0;
        var interval = setInterval(function () {
            var el = this.iconElements[n++];
            // animation in Raphael.js
            el.animate({transform: 's.7'}, 800,'>');

            if (n == 4) {
            clearInterval(interval)
            }
        }.bind(this), 500);


    }

    MapIconsPanel.prototype.animateDown = function () {
        var n = 4;
        var interval = setInterval(function () {
            var el = this.iconElements[n--];
            // animation in Raphael.js
            el.animate({transform: '0'}, 800,'>');

            if (n <0) {
            clearInterval(interval)
            }
        }.bind(this), 500);


    }

    MapIconsPanel.DEFAULT_OPTIONS = {
        iconsPanelSize: [150, 40],
        iconsGridSize: [140, 40],
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
            transform: Transform.translate(470, 210, 9)

        });

        this.rootNode = this.add(this.centerModifier);
    }


    /**
     * =Map Svet Icons
     */

    /*Raphael Icon Design*/

    function _getRaphaelIcon(file) {
        var divDaily = document.createElement('div');
        var paper = Raphael(divDaily, 40, 40);
        var element = paper.path(file).attr({fill: '#797979', stroke: 'none'});
        element.transform('t10,5, s0');
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
        this.gridIconTrans = new Transitionable(1);

        this.gridIconsMod = new Modifier({
            size: [undefined, 40],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],

            opacity: function () {
                return this.gridIconTrans.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });

        this.gridLayout = new GridLayout({
            dimensions: [4, 1]
        });
        this.surfaces = [];
        this.gridLayout.sequenceFrom(this.surfaces);


        var dailySvg = 'M28.916,8.009L15.953,1.888c-0.251-0.119-0.548-0.115-0.798,0.008c-0.25,0.125-0.433,0.357-0.491,0.629c-0.002,0.01-1.04,4.83-2.578,9.636c-0.526,1.646-1.114,3.274-1.728,4.704l1.665,0.786c2-4.643,3.584-11.052,4.181-13.614l11.264,5.316c-0.346,1.513-1.233,5.223-2.42,8.927c-0.767,2.399-1.665,4.797-2.585,6.532c-0.889,1.79-1.958,2.669-2.197,2.552c-1.419,0.03-2.418-1.262-3.09-2.918c-0.32-0.803-0.53-1.63-0.657-2.246c-0.127-0.618-0.166-1.006-0.168-1.006c-0.034-0.317-0.232-0.597-0.52-0.731l-12.962-6.12c-0.301-0.142-0.654-0.11-0.925,0.081c-0.27,0.193-0.416,0.518-0.38,0.847c0.008,0.045,0.195,1.848,0.947,3.736c0.521,1.321,1.406,2.818,2.845,3.575l12.956,6.131l0.006-0.013c0.562,0.295,1.201,0.487,1.947,0.496c1.797-0.117,2.777-1.668,3.818-3.525c3-5.69,5.32-16.602,5.338-16.642C29.512,8.615,29.302,8.19,28.916,8.009z';
        this.dailyNewsIcon = new Surface({
            properties: this.options.mapIconProps,
            content: _getRaphaelIcon.call(this, dailySvg)
        });

        var weeklySvg = 'M22,4.582h-2v3.335h2V4.582zM25.416,5.748H23v3.17h-4v-3.17h-6v3.168H9.002V5.748H6.583v21.555h18.833V5.748zM24.418,26.303H7.584V13.988h16.833V26.303zM12,4.582h-2v3.335h2V4.582zM19.428,23.962h1.568v-7.788h-1.277c0,0.067-0.021,0.172-0.061,0.312c-0.066,0.232-0.168,0.419-0.299,0.559c-0.193,0.204-0.443,0.34-0.75,0.408c-0.193,0.043-0.531,0.075-1.014,0.097v1.042h1.832V23.962zM13.673,22.909c-0.489,0-0.827-0.188-1.013-0.564c-0.101-0.203-0.15-0.461-0.15-0.773h-1.504c0.025,0.62,0.15,1.121,0.376,1.504c0.429,0.721,1.194,1.08,2.296,1.08c0.895,0,1.569-0.25,2.026-0.749c0.455-0.5,0.684-1.079,0.684-1.737c0-0.627-0.195-1.121-0.586-1.482c-0.261-0.24-0.461-0.36-0.602-0.36c0.187-0.071,0.365-0.206,0.537-0.403c0.272-0.314,0.408-0.701,0.408-1.16c0-0.647-0.228-1.164-0.684-1.549c-0.456-0.386-1.056-0.578-1.8-0.578c-0.4,0-0.738,0.049-1.014,0.146c-0.276,0.097-0.514,0.236-0.714,0.419c-0.269,0.258-0.465,0.539-0.591,0.843c-0.117,0.348-0.184,0.715-0.198,1.102h1.429c-0.007-0.384,0.074-0.689,0.244-0.919c0.169-0.229,0.435-0.344,0.795-0.344c0.314,0,0.559,0.094,0.731,0.279c0.174,0.187,0.26,0.428,0.26,0.726c0,0.458-0.169,0.763-0.508,0.913c-0.196,0.09-0.543,0.138-1.039,0.145v1.096c0.507,0,0.878,0.049,1.114,0.146c0.414,0.172,0.621,0.514,0.621,1.026c0,0.387-0.112,0.683-0.335,0.889C14.234,22.807,13.973,22.909,13.673,22.909z';
        this.weeklyNewsIcon = new Surface({
            properties: this.options.mapIconProps,
            content: _getRaphaelIcon.call(this, weeklySvg)
        });

        var yPSvg = 'M22.065,18.53c-0.467-0.29-1.167-0.21-1.556,0.179l-3.093,3.092c-0.389,0.389-1.025,0.389-1.414,0L9.05,14.848c-0.389-0.389-0.389-1.025,0-1.414l2.913-2.912c0.389-0.389,0.447-1.075,0.131-1.524L6.792,1.485C6.476,1.036,5.863,0.948,5.433,1.29c0,0-4.134,3.281-4.134,6.295c0,12.335,10,22.334,22.334,22.334c3.015,0,5.948-5.533,5.948-5.533c0.258-0.486,0.087-1.122-0.38-1.412L22.065,18.53z';
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
