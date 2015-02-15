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

    function _getNewsPaperSvg() {

        var div = document.createElement('div');
        var rsr = Raphael(div, '707.08618', '605.22797');
        var layer1 = rsr.set();
        this.iconElements.push(layer1);
        layer1.attr({'id': 'layer1', 'name': 'layer1'});
        layer1.transform("t-17.057461,-165.0282");
        var g4123 = rsr.set();
        var path4105 = rsr.path("M 32.324881,539.20469 226.27417,708.91032 c 0,0 20.20305,20.20305 40.4061,16.16244 20.20305,-4.04061 408.10163,-303.04577 408.10163,-303.04577 0,0 12.12183,-12.12183 8.08122,-36.36549 C 678.82251,361.41784 472.75139,236.15893 472.75139,236.15893 z").attr({
            id: 'path4105',
            parent: 'layer1',
            fill: '0-#000000:0-#000000:100',
            'fill-opacity': '0',
            "fill-opacity": '1',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1',
            filter: 'url(#filter4119)'
        }).transform("t-17.057461,-165.0282 m0.915589,0,0,0.915589,42.813913,50.545555").data('id', 'path4105');
        var rect2985 = rsr.rect(11.428572, 112.36218, 717.14288, 717.14288).attr({
            y: '112.36218',
            x: '11.428572',
            id: 'rect2985',
            parent: 'layer1',
            fill: 'none',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
        }).transform("t-17.057461,-165.0282").data('id', 'rect2985');
        var path4019 = rsr.path("m 70.710677,446.77573 c 0,0 1.778647,38.42985 -7.071067,50.00255 14.142135,10.6066 130.54823,114.21069 167.68533,145.96704 14.78208,12.64033 37.97601,18.39239 48.99239,6.56599 C 298.10576,610.46497 72.828255,445.89847 70.710677,446.77573 z").attr({
            id: 'path4019',
            parent: 'layer1',
            fill: '#888a85',
            stroke: '#2e3436',
            "stroke-width": '10',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4019');
        var path4021 = rsr.path("M 87.378195,445.26051 443.45696,186.66145 c 0,0 89.66553,51.96865 154.04827,102.53048 19.23791,15.10815 55.36498,60.71019 25.75889,90.91373 -38.52812,39.3056 -335.71815,251.94619 -335.37064,252.03307 0,0 -5.55584,-18.18275 -21.71828,-36.3655 C 250.01276,577.59049 87.378195,445.26051 87.378195,445.26051 z").attr({
            id: 'path4021',
            parent: 'layer1',
            opacity: '0.65094341',
            fill: '310.1430589609-#ffffff:0-#ffffff:100',
            'fill-opacity': '0',
            "fill-opacity": '1',
            stroke: '#ffffff',
            "stroke-width": '10',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4021');
        var path4035 = rsr.path("m 77.930331,467.5419 c -0.184356,-0.91744 1.743574,9.62075 -4.607774,27.30909 12.547946,9.36665 117.914333,101.61927 149.792953,130.41814 13.27095,11.98886 38.23942,29.55468 45.74113,21.13114 C 284.63984,612.09523 79.809202,466.76719 77.930331,467.5419 z").attr({
            id: 'path4035',
            parent: 'layer1',
            opacity: '0.50628931',
            fill: '#2e3436',
            stroke: '#ffffff',
            "stroke-width": '5.31',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4035');
        var path4015 = rsr.path("M 67.175144,444.75543 442.44681,173.52947 c 0,0 101.28228,58.53464 165.66502,109.09647 19.23791,15.10815 55.55839,66.67008 28.28427,98.99495 -34.09849,40.41301 -356.58384,270.72089 -356.58384,270.72089 0,0 -4.54569,-29.7995 -20.70813,-47.98225 C 242.94169,586.17679 67.175144,444.75543 67.175144,444.75543 z").attr({
            id: 'path4015',
            parent: 'layer1',
            fill: '#d3d7cf',
            stroke: '#555753',
            "stroke-width": '17',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4015');
        var path4031 = rsr.path("M 87.378195,445.26051 443.45696,186.66145 c 0,0 89.66553,51.96865 154.04827,102.53048 19.23791,15.10815 55.36498,60.71019 25.75889,90.91373 -38.52812,39.3056 -335.71815,251.94619 -335.37064,252.03307 0,0 -5.55584,-18.18275 -21.71828,-36.3655 C 250.01276,577.59049 87.378195,445.26051 87.378195,445.26051 z").attr({
            id: 'path4031',
            parent: 'layer1',
            opacity: '0.65094341',
            fill: 'none',
            stroke: '#ffffff',
            "stroke-width": '10',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4031');
        var path4037 = rsr.path("M 78.286822,492.2326 C 78.168779,491.76043 239.52368,635.49755 255.36682,640.26327 295.27409,652.26764 139.03519,510.09936 81.822356,477.83792").attr({
            id: 'path4037',
            parent: 'layer1',
            fill: 'none',
            stroke: '#2e3436',
            "stroke-width": '3',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4037');
        var path4039 = rsr.path("M 80.714286,489.1479 C 139.96119,537.81426 206.68576,597.47499 256.42857,635.21932 208.89776,576.67487 140.48583,533.30738 82.5,482.36218").attr({
            id: 'path4039',
            parent: 'layer1',
            fill: 'none',
            stroke: '#2e3436',
            "stroke-width": '3',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4039');
        var path4041 = rsr.path("M 135.36044,446.27066 440.42651,219.99649 501.03566,264.4432 195.9696,494.75799 z").attr({
            id: 'path4041',
            parent: 'layer1',
            fill: '#888a85',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
        }).transform("t-17.057461,-165.0282").data('id', 'path4041');
        var path4043 = rsr.path("m 400.02041,385.6615 119.198,-94.95434 72.73098,48.48733 c 0,0 22.22336,16.16244 20.20305,32.32488 -2.0203,16.16244 -2.0203,16.16244 -2.0203,16.16244 l -117.1777,86.87312 c 0,0 -3.50083,-20.58666 -12.12183,-27.22336 -10.81581,-8.32632 -80.8122,-61.67007 -80.8122,-61.67007 z").attr({
            id: 'path4043',
            parent: 'layer1',
            fill: '#eeeeec',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
        }).transform("t-17.057461,-165.0282").data('id', 'path4043');
        var path4045 = rsr.path("M 421.42857,388.07647 523.57143,306.6479").attr({
            id: 'path4045',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '4',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4045');
        var path4047 = rsr.path("m 452.64393,392.64156 74.71214,-59.84447").attr({
            id: 'path4047',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4047');
        var path4049 = rsr.path("M 450.66999,410.37469 552.18715,330.77825").attr({
            id: 'path4049',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4049');
        var path4051 = rsr.path("m 460.82849,417.75602 99.0573,-75.78768").attr({
            id: 'path4051',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4051');
        var path4053 = rsr.path("M 470.02138,428.20307 572.83576,347.23558").attr({
            id: 'path4053',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4053');
        var path4055 = rsr.path("M 478.5705,439.28348 586.42949,356.15517").attr({
            id: 'path4055',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4055');
        var path4057 = rsr.path("M 495.07973,444.45169 588.4917,373.84411").attr({
            id: 'path4057',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4057');
        var path4059 = rsr.path("m 500.41108,458.07138 101.3207,-78.56125").attr({
            id: 'path4059',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'butt',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4059');
        var path4061 = rsr.path("m 222.23356,504.8595 153.54319,-111.11678 88.89342,66.67007 c 11.09666,9.42809 12.29765,18.85618 12.12183,28.28427 l -161.62441,117.1777 c 0,0 -2.0203,-32.32488 -10.10152,-36.36549 -8.08122,-4.04061 -82.83251,-64.64977 -82.83251,-64.64977 z").attr({
            id: 'path4061',
            parent: 'layer1',
            fill: '#eeeeec',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
        }).transform("t-17.057461,-165.0282").data('id', 'path4061');
        var path4063 = rsr.path("M 259.83839,510.27071 321.5067,466.28623").attr({
            id: 'path4063',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '4',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4063');
        var path4065 = rsr.path("m 329.30973,454.35188 47.47717,-36.3655 46.46702,33.33504 -47.47718,34.34518 z").attr({
            id: 'path4065',
            parent: 'layer1',
            fill: '#babdb6',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
        }).transform("t-17.057461,-165.0282").data('id', 'path4065');
        var path4067 = rsr.path("m 266.52696,527.84765 75.84373,-52.91286").attr({
            id: 'path4067',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4067');
        var path4069 = rsr.path("m 277.63864,535.92887 75.84373,-52.91286").attr({
            id: 'path4069',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4069');
        var path4071 = rsr.path("M 289.76047,546.0304 365.6042,493.11754").attr({
            id: 'path4071',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4071');
        var path4073 = rsr.path("M 305.6132,556.44164 436.6246,467.55402").attr({
            id: 'path4073',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2.01',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4073');
        var path4075 = rsr.path("M 318.74518,569.57362 449.75658,480.686").attr({
            id: 'path4075',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2.01',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4075');
        var path4077 = rsr.path("M 326.82431,582.70769 455.81959,492.80573").attr({
            id: 'path4077',
            parent: 'layer1',
            opacity: '0.42767298',
            fill: 'none',
            stroke: '#000000',
            "stroke-width": '2',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'miter',
            "stroke-miterlimit": '4',
            "stroke-opacity": '1',
            "stroke-dasharray": 'none'
        }).transform("t-17.057461,-165.0282").data('id', 'path4077');
        var path4079 = rsr.path("M 284.14873,642.06693 C 283.3683,620.4952 245.47389,578.66198 223.67084,564.47773 L 604.27428,289.06322 c 18.74301,12.00807 50.67887,62.61649 28.01994,91.25165 -98.13709,83.01574 -235.54937,181.51478 -348.14549,261.75206 z").attr({
            id: 'path4079',
            parent: 'layer1',
            fill: '125.96013382777-#000000:0-#000000:100',
            'fill-opacity': '0',
            "fill-opacity": '1',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
        }).transform("t-17.057461,-165.0282").data('id', 'path4079');
        g4123.attr({
            'id': 'g4123',
            'transformG': 'translate(-17.057461,-165.0282)',
            'parent': 'layer1',
            'name': 'g4123'
        });
        var rsrGroups = [layer1, g4123];
        layer1.push();
        g4123.push(path4105, rect2985, path4019, path4021, path4035, path4015, path4031, path4037, path4039, path4041, path4043, path4045, path4047, path4049, path4051, path4053, path4055, path4057, path4059, path4061, path4063, path4065, path4067, path4069, path4071, path4073, path4075, path4077, path4079);
        g4123.transform('s0.5');
        return div;
    }


    MapIconsPanel.prototype = Object.create(View.prototype);
    MapIconsPanel.prototype.constructor = MapIconsPanel;

    MapIconsPanel.prototype.animateUp = function () {
        this.gridIconTrans.halt();
        this.gridIconTrans.set(1, {duration: 400, curve: "easeOutBounce"});
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
                    this.gridIconTrans.set(0, {duration: 1000, curve: "easeOutBounce"});
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
            align: [0.6, 0.05],
            origin: [0.5, 0.5],
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

    /*=Raphael Icon Design*/

    function _getRaphaelIcon(file) {
        var divDaily = document.createElement('div');
        var paper = Raphael(divDaily, 50, 50);
        var element = paper.path(file).attr({fill: window.sv.scheme.lightRed, stroke: 'none'});
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
            gutterSize: [2, 2]
        });
        this.surfaces = [];
        this.gridLayout.sequenceFrom(this.surfaces);

        var dailySvg = _getNewsPaperSvg.call(this);

        this.dailyNewsIcon = new Surface({
            properties: this.options.mapIconProps,
            content: dailySvg
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
