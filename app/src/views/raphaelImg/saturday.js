define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    saturday.prototype = Object.create(View.prototype);
    saturday.prototype.constructor = saturday;
    saturday.DEFAULT_OPTIONS = {};

    function saturday() {
        this.background = 'white';
        this.purple = '#552D90';
        this.grey = '#393939';
        this.border = '1px solid #E5E5E5';
            View.apply(this, arguments);
        _init.call(this);
        var div = document.createElement('div');
        var mySVG = Raphael(div, 707.08618, 605.22797, {
            "path": "M 32.324881,539.20469 226.27417,708.91032 c 0,0 20.20305,20.20305 40.4061,16.16244 20.20305,-4.04061 408.10163,-303.04577 408.10163,-303.04577 0,0 12.12183,-12.12183 8.08122,-36.36549 C 678.82251,361.41784 472.75139,236.15893 472.75139,236.15893 z",
            "fill-opacity": "1",
            "filter": "url(#filter4119)",
            "fill": "red",
            "stroke": "none",
            "type": "path"
        }, {
            "x": 11.428572,
            "stroke": "none",
            "y": 112.36218,
            "width": 717.14288,
            "height": 717.14288,
            "fill": "none",
            "type": "rect"
        }, {
            "path": "m 70.710677,446.77573 c 0,0 1.778647,38.42985 -7.071067,50.00255 14.142135,10.6066 130.54823,114.21069 167.68533,145.96704 14.78208,12.64033 37.97601,18.39239 48.99239,6.56599 C 298.10576,610.46497 72.828255,445.89847 70.710677,446.77573 z",
            "stroke": "#2e3436",
            "stroke-miterlimit": "4",
            "stroke-opacity": "1",
            "type": "path",
            "fill": "#888a85",
            "stroke-linecap": "butt",
            "stroke-width": "10",
            "stroke-linejoin": "miter",
            "stroke-dasharray": "none"
        }, {
            "stroke": "#ffffff",
            "stroke-dasharray": "none",
            "fill-opacity": "1",
            "fill": "black",
            "stroke-linecap": "butt",
            "stroke-linejoin": "miter",
            "opacity": "0.65094341",
            "path": "M 87.378195,445.26051 443.45696,186.66145 c 0,0 89.66553,51.96865 154.04827,102.53048 19.23791,15.10815 55.36498,60.71019 25.75889,90.91373 -38.52812,39.3056 -335.71815,251.94619 -335.37064,252.03307 0,0 -5.55584,-18.18275 -21.71828,-36.3655 C 250.01276,577.59049 87.378195,445.26051 87.378195,445.26051 z",
            "stroke-miterlimit": "4",
            "stroke-opacity": "1",
            "stroke-width": "10",
            "type": "path"
        }, {
            "opacity": "0.50628931",
            "path": "m 77.930331,467.5419 c -0.184356,-0.91744 1.743574,9.62075 -4.607774,27.30909 12.547946,9.36665 117.914333,101.61927 149.792953,130.41814 13.27095,11.98886 38.23942,29.55468 45.74113,21.13114 C 284.63984,612.09523 79.809202,466.76719 77.930331,467.5419 z",
            "stroke": "#ffffff",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "#2e3436",
            "stroke-linecap": "butt",
            "stroke-width": "5.31109476",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "path": "M 67.175144,444.75543 442.44681,173.52947 c 0,0 101.28228,58.53464 165.66502,109.09647 19.23791,15.10815 55.55839,66.67008 28.28427,98.99495 -34.09849,40.41301 -356.58384,270.72089 -356.58384,270.72089 0,0 -4.54569,-29.7995 -20.70813,-47.98225 C 242.94169,586.17679 67.175144,444.75543 67.175144,444.75543 z",
            "stroke": "#555753",
            "stroke-miterlimit": "4",
            "stroke-opacity": "1",
            "type": "path",
            "fill": "#d3d7cf",
            "stroke-linecap": "butt",
            "stroke-width": "17",
            "stroke-linejoin": "round",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.65094341",
            "path": "M 87.378195,445.26051 443.45696,186.66145 c 0,0 89.66553,51.96865 154.04827,102.53048 19.23791,15.10815 55.36498,60.71019 25.75889,90.91373 -38.52812,39.3056 -335.71815,251.94619 -335.37064,252.03307 0,0 -5.55584,-18.18275 -21.71828,-36.3655 C 250.01276,577.59049 87.378195,445.26051 87.378195,445.26051 z",
            "stroke": "#ffffff",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "butt",
            "stroke-width": "10",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "path": "M 78.286822,492.2326 C 78.168779,491.76043 239.52368,635.49755 255.36682,640.26327 295.27409,652.26764 139.03519,510.09936 81.822356,477.83792",
            "stroke": "#2e3436",
            "stroke-miterlimit": "4",
            "stroke-opacity": "1",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "butt",
            "stroke-width": "3",
            "stroke-linejoin": "miter",
            "stroke-dasharray": "none"
        }, {
            "path": "M 80.714286,489.1479 C 139.96119,537.81426 206.68576,597.47499 256.42857,635.21932 208.89776,576.67487 140.48583,533.30738 82.5,482.36218",
            "stroke": "#2e3436",
            "stroke-miterlimit": "4",
            "stroke-opacity": "1",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "3",
            "stroke-linejoin": "miter",
            "stroke-dasharray": "none"
        }, {
            "fill": "#888a85",
            "stroke": "none",
            "type": "path",
            "path": "M 135.36044,446.27066 440.42651,219.99649 501.03566,264.4432 195.9696,494.75799 z"
        }, {
            "fill": "#eeeeec",
            "stroke": "none",
            "type": "path",
            "path": "m 400.02041,385.6615 119.198,-94.95434 72.73098,48.48733 c 0,0 22.22336,16.16244 20.20305,32.32488 -2.0203,16.16244 -2.0203,16.16244 -2.0203,16.16244 l -117.1777,86.87312 c 0,0 -3.50083,-20.58666 -12.12183,-27.22336 -10.81581,-8.32632 -80.8122,-61.67007 -80.8122,-61.67007 z"
        }, {
            "opacity": "0.42767298",
            "path": "M 421.42857,388.07647 523.57143,306.6479",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "4",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "m 452.64393,392.64156 74.71214,-59.84447",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 450.66999,410.37469 552.18715,330.77825",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "m 460.82849,417.75602 99.0573,-75.78768",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 470.02138,428.20307 572.83576,347.23558",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 478.5705,439.28348 586.42949,356.15517",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 495.07973,444.45169 588.4917,373.84411",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "m 500.41108,458.07138 101.3207,-78.56125",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "butt",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "fill": "#eeeeec",
            "stroke": "none",
            "type": "path",
            "path": "m 222.23356,504.8595 153.54319,-111.11678 88.89342,66.67007 c 11.09666,9.42809 12.29765,18.85618 12.12183,28.28427 l -161.62441,117.1777 c 0,0 -2.0203,-32.32488 -10.10152,-36.36549 -8.08122,-4.04061 -82.83251,-64.64977 -82.83251,-64.64977 z"
        }, {
            "opacity": "0.42767298",
            "path": "M 259.83839,510.27071 321.5067,466.28623",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "4",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "fill": "#babdb6",
            "stroke": "none",
            "type": "path",
            "path": "m 329.30973,454.35188 47.47717,-36.3655 46.46702,33.33504 -47.47718,34.34518 z"
        }, {
            "opacity": "0.42767298",
            "path": "m 266.52696,527.84765 75.84373,-52.91286",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "m 277.63864,535.92887 75.84373,-52.91286",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 289.76047,546.0304 365.6042,493.11754",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 305.6132,556.44164 436.6246,467.55402",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2.00870752",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 318.74518,569.57362 449.75658,480.686",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2.00870752",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "opacity": "0.42767298",
            "path": "M 326.82431,582.70769 455.81959,492.80573",
            "stroke": "#000000",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": "4",
            "type": "path",
            "fill": "none",
            "stroke-linecap": "round",
            "stroke-width": "2.00453186",
            "stroke-opacity": "1",
            "stroke-dasharray": "none"
        }, {
            "path": "M 284.14873,642.06693 C 283.3683,620.4952 245.47389,578.66198 223.67084,564.47773 L 604.27428,289.06322 c 18.74301,12.00807 50.67887,62.61649 28.01994,91.25165 -98.13709,83.01574 -235.54937,181.51478 -348.14549,261.75206 z",
            "fill": "url(#linearGradient4103)",
            "stroke": "none",
            "fill-opacity": "1",
            "type": "path"
        });


        this.surface = new Surface({
            content: div,
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.surface);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [138, 30],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.surface = new Surface({
            content: _saturdaySvg.call(this),
            properties: {
                backgroundColor: this.background,
                border: this.border,
                cursor: 'pointer'
            }
        });

        //this.surface.on('mouseover', function () {
        //    for (var n = 0; n < this.group_a.length; n++) {
        //        var pathElem = this.group_a[n];
        //        pathElem.animate({fill: this.light[n]}, 100);
        //
        //    }
        //
        //}.bind(this));
        //this.surface.on('mouseout', function () {
        //    for (var n = 0; n < this.group_a.length; n++) {
        //        var pathElem = this.group_a[n];
        //        pathElem.animate({fill: this.init[n]}, 100);
        //
        //    }
        //
        //}.bind(this));

        this.surface.pipe(this._eventOutput);

        this.rootNode = this.add(this.centerModifier);
        //this.rootNode.add(this.surface);
    }

    function _saturdaySvg() {
        var divSat = document.createElement('div');
        var paper = Raphael(divSat, '140', '100');

        var rect_a = paper.rect(0.866, 13.101, 62.636, 2.446).attr({
            x: '0.866',
            y: '13.101',
            fill: this.purple,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'rect_a');
        var path_b = paper.path("M9.562,12.597c-0.813,0.394-1.875,0.591-3.185,0.591c-1.709,0-3.052-0.502-4.03-1.507 S0.879,9.338,0.879,7.665c0-1.781,0.55-3.225,1.649-4.333C3.629,2.224,5.057,1.67,6.812,1.67c1.088,0,2.004,0.137,2.75,0.412v2.415 C8.815,4.052,7.967,3.829,7.014,3.829c-1.046,0-1.89,0.329-2.531,0.986C3.84,5.473,3.519,6.363,3.519,7.487 c0,1.076,0.304,1.935,0.909,2.574s1.421,0.959,2.446,0.959c0.979,0,1.874-0.238,2.688-0.715V12.597z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_b');
        var path_c = paper.path("M17.752,5.041l-3.074,8.17c-0.901,1.736-1.854,2.279-3.354,2.336H9.277l0.266-1.73 c1.391,0.35,2.047,0.256,2.804-0.839L9.115,5.041h2.719c0,0,1.648,5.494,1.7,5.902h0.031c0.047-0.3,1.755-5.902,1.755-5.902H17.752 z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_c');
        var path_d = paper.path("M24.483,1.033v1.941c-0.249,0.191-0.58,0.318-0.994,0.38c-1.165,0.182-1.861,0.298-2.089,0.35 c-0.472,0.109-0.814,0.256-1.029,0.443c-0.215,0.186-0.391,0.458-0.528,0.815c-0.137,0.357-0.231,0.792-0.283,1.305h0.031 c0.59-0.678,1.379-1.018,2.368-1.018c1.129,0,2.008,0.335,2.637,1.006c0.629,0.671,0.943,1.596,0.943,2.776 c0,1.264-0.386,2.271-1.157,3.025c-0.771,0.753-1.816,1.13-3.137,1.13c-1.383,0-2.434-0.44-3.153-1.32s-1.08-2.154-1.08-3.821 c0-0.797,0.06-1.518,0.179-2.163s0.298-1.214,0.536-1.709c0.238-0.494,0.532-0.907,0.882-1.239 c0.349-0.331,0.706-0.573,1.071-0.726c0.365-0.152,0.724-0.267,1.076-0.342c0.352-0.075,1.234-0.221,2.647-0.438 C23.87,1.31,24.229,1.178,24.483,1.033z M19.52,7.983c-0.011,0.125-0.016,0.368-0.016,0.73c0,0.792,0.159,1.423,0.478,1.892 c0.318,0.468,0.76,0.702,1.324,0.702c0.513,0,0.93-0.196,1.251-0.59c0.32-0.394,0.481-0.919,0.481-1.577 c0-0.667-0.162-1.189-0.485-1.564c-0.324-0.375-0.761-0.563-1.309-0.563c-0.357,0-0.695,0.094-1.014,0.28S19.675,7.71,19.52,7.983z ").attr({
            fill: this.grey,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_d');
        var path_e = paper.path("M32.651,1.033v1.941c-0.249,0.191-0.58,0.318-0.994,0.38c-1.165,0.182-1.861,0.298-2.089,0.35 c-0.472,0.109-0.814,0.256-1.029,0.443c-0.215,0.186-0.391,0.458-0.528,0.815c-0.137,0.357-0.231,0.792-0.283,1.305h0.031 c0.59-0.678,1.379-1.018,2.368-1.018c1.129,0,2.008,0.335,2.637,1.006c0.629,0.671,0.943,1.596,0.943,2.776 c0,1.264-0.386,2.271-1.157,3.025c-0.771,0.753-1.816,1.13-3.137,1.13c-1.383,0-2.434-0.44-3.153-1.32s-1.08-2.154-1.08-3.821 c0-0.797,0.06-1.518,0.179-2.163s0.298-1.214,0.536-1.709c0.238-0.494,0.532-0.907,0.882-1.239 c0.349-0.331,0.706-0.573,1.071-0.726c0.365-0.152,0.724-0.267,1.076-0.342c0.352-0.075,1.234-0.221,2.647-0.438 C32.038,1.31,32.397,1.178,32.651,1.033z M27.688,7.983c-0.011,0.125-0.016,0.368-0.016,0.73c0,0.792,0.159,1.423,0.478,1.892 c0.318,0.468,0.76,0.702,1.324,0.702c0.513,0,0.93-0.196,1.251-0.59c0.32-0.394,0.481-0.919,0.481-1.577 c0-0.667-0.162-1.189-0.485-1.564c-0.324-0.375-0.761-0.563-1.309-0.563c-0.357,0-0.695,0.094-1.014,0.28S27.844,7.71,27.688,7.983 z").attr({
            fill: '#562E8F',
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_e');
        var path_f = paper.path("M37.458,13.188c-1.326,0-2.368-0.372-3.126-1.114c-0.759-0.743-1.138-1.752-1.138-3.025 c0-1.315,0.393-2.344,1.18-3.087s1.852-1.115,3.192-1.115c1.321,0,2.356,0.372,3.106,1.115c0.752,0.743,1.127,1.726,1.127,2.947 c0,1.32-0.387,2.363-1.162,3.13C39.863,12.805,38.803,13.188,37.458,13.188z M37.519,6.726c-0.58,0-1.03,0.199-1.352,0.599 c-0.32,0.398-0.481,0.963-0.481,1.692c0,1.527,0.616,2.291,1.849,2.291c1.176,0,1.762-0.784,1.762-2.353 C39.297,7.469,38.705,6.726,37.519,6.726z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_f');
        var path_g = paper.path("M54.916,12.993h-2.321v-1.142h-0.031c-0.533,0.891-1.323,1.336-2.369,1.336 c-0.771,0-1.378-0.219-1.821-0.656c-0.442-0.438-0.664-1.021-0.664-1.752c0-1.542,0.914-2.433,2.742-2.671l2.158-0.288 c0-0.869-0.471-1.304-1.413-1.304c-0.947,0-1.849,0.281-2.702,0.846V5.514c0.341-0.176,0.809-0.331,1.401-0.466 s1.133-0.202,1.619-0.202c2.268,0,3.401,1.131,3.401,3.394V12.993z M52.609,9.763V9.227l-1.444,0.187 c-0.797,0.104-1.195,0.463-1.195,1.079c0,0.28,0.097,0.509,0.291,0.688s0.457,0.268,0.788,0.268c0.461,0,0.836-0.159,1.126-0.478 S52.609,10.249,52.609,9.763z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_g');
        var path_h = paper.path("M 41.023,5.041 41.023,6.904 43.563,6.904 43.563,12.993 46.032,12.993 46.032,6.904 48.563,6.904 48.563,5.041 z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_h');
        var rect_i = paper.rect(58.041, 4.602, 2.336, 8.586).attr({
            x: '58.041',
            y: '4.602',
            fill: this.purple,
            parent: 'group'
        }).data('id', 'rect_i');
        var rect_j = paper.rect(54.916, 7.727, 8.586, 2.336).attr({
            x: '54.916',
            y: '7.727',
            fill: this.purple,
            parent: 'group',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'rect_j');

        var group = paper.set();
        group.attr({'id': 'group', 'name': 'group'});
        var rsrGroups = [group];
        group.push(rect_a, path_b, path_c, path_d, path_e, path_f, path_g, path_h, rect_i, rect_j);
        /*Scale Raphael Svg Group */

        //group_a.transform('s5');
        var hslColorsInit = [];
        var hslColorsLight = [];
        var step = 3.7;

        group.transform('...s1.3,1.3, 0,0, t19,2');
        this.group_a = group;

        this.init = hslColorsInit;
        this.light = hslColorsLight;

        return divSat;
    }

    module.exports = saturday;
});
