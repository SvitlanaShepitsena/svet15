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
        this.border = '1px solid #999999',
            View.apply(this, arguments);
        _init.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [138, 24],
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

        this.surface.on('mouseover', function () {
            for (var n = 0; n < this.group_a.length; n++) {
                var pathElem = this.group_a[n];
                pathElem.animate({fill: this.light[n]}, 100);

            }

        }.bind(this));
        this.surface.on('mouseout', function () {
            for (var n = 0; n < this.group_a.length; n++) {
                var pathElem = this.group_a[n];
                pathElem.animate({fill: this.init[n]}, 100);

            }

        }.bind(this));

        this.surface.pipe(this._eventOutput);

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    function _saturdaySvg() {
        var divSat = document.createElement('div');

        var rsr = Raphael(divSat, '140', '100');
        var Text = rsr.set();
        Text.attr({'id': 'Text', 'name': 'Text'});
        var group_a = rsr.set();
        var path_b = rsr.path("M32.065,29.368c-0.813,0.394-1.875,0.591-3.185,0.591c-1.709,0-3.052-0.502-4.03-1.507 s-1.468-2.343-1.468-4.016c0-1.781,0.55-3.225,1.649-4.333c1.101-1.108,2.528-1.662,4.283-1.662c1.088,0,2.004,0.137,2.75,0.412 v2.415c-0.746-0.445-1.595-0.667-2.548-0.667c-1.046,0-1.89,0.329-2.531,0.986c-0.643,0.657-0.964,1.548-0.964,2.672 c0,1.076,0.304,1.935,0.909,2.574s1.421,0.959,2.446,0.959c0.979,0,1.874-0.238,2.688-0.715V29.368z").attr({
            fill: window.sv.scheme.textDark,
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_b');
        var path_c = rsr.path("M41.338,21.812l-3.231,8.589c-0.776,2.066-1.946,3.099-3.51,3.099c-0.596,0-1.085-0.067-1.468-0.202 v-1.957c0.326,0.191,0.681,0.288,1.063,0.288c0.632,0,1.072-0.298,1.32-0.894l0.42-0.986l-3.231-7.937h2.719l1.483,4.838 c0.093,0.3,0.165,0.655,0.217,1.063h0.031c0.047-0.3,0.132-0.649,0.257-1.048l1.498-4.854H41.338z").attr({
            fill: window.sv.scheme.textDark,
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_c');
        var path_d = rsr.path("M49.368,17.805v1.941c-0.249,0.191-0.58,0.318-0.994,0.38c-1.165,0.182-1.861,0.298-2.089,0.35 c-0.472,0.109-0.814,0.256-1.029,0.443c-0.215,0.186-0.391,0.458-0.528,0.815c-0.137,0.357-0.231,0.792-0.283,1.305h0.031 c0.59-0.678,1.379-1.018,2.368-1.018c1.129,0,2.008,0.335,2.637,1.006c0.629,0.671,0.943,1.596,0.943,2.776 c0,1.264-0.386,2.271-1.157,3.025c-0.771,0.753-1.816,1.13-3.137,1.13c-1.383,0-2.434-0.44-3.153-1.32s-1.08-2.154-1.08-3.821 c0-0.797,0.06-1.518,0.179-2.163s0.298-1.214,0.536-1.709c0.238-0.494,0.532-0.907,0.882-1.239 c0.349-0.331,0.706-0.573,1.071-0.726c0.365-0.152,0.724-0.267,1.076-0.342c0.352-0.075,1.234-0.221,2.647-0.438 C48.754,18.082,49.114,17.95,49.368,17.805z M44.405,24.755c-0.011,0.125-0.016,0.368-0.016,0.73c0,0.792,0.159,1.423,0.478,1.892 c0.318,0.468,0.76,0.702,1.324,0.702c0.513,0,0.93-0.196,1.251-0.59c0.32-0.394,0.481-0.919,0.481-1.577 c0-0.667-0.162-1.189-0.485-1.564c-0.324-0.375-0.761-0.563-1.309-0.563c-0.357,0-0.695,0.094-1.014,0.28 S44.56,24.481,44.405,24.755z").attr({
            fill: window.sv.scheme.textDark,
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_d');
        var path_e = rsr.path("M59.053,17.805v1.941c-0.249,0.191-0.58,0.318-0.994,0.38c-1.165,0.182-1.861,0.298-2.089,0.35 c-0.472,0.109-0.814,0.256-1.029,0.443c-0.215,0.186-0.391,0.458-0.528,0.815c-0.137,0.357-0.231,0.792-0.283,1.305h0.031 c0.59-0.678,1.379-1.018,2.368-1.018c1.129,0,2.008,0.335,2.637,1.006c0.629,0.671,0.943,1.596,0.943,2.776 c0,1.264-0.386,2.271-1.157,3.025c-0.771,0.753-1.816,1.13-3.137,1.13c-1.383,0-2.434-0.44-3.153-1.32s-1.08-2.154-1.08-3.821 c0-0.797,0.06-1.518,0.179-2.163s0.298-1.214,0.536-1.709c0.238-0.494,0.532-0.907,0.882-1.239 c0.349-0.331,0.706-0.573,1.071-0.726c0.365-0.152,0.724-0.267,1.076-0.342c0.352-0.075,1.234-0.221,2.647-0.438 C58.44,18.082,58.799,17.95,59.053,17.805z M54.09,24.755c-0.011,0.125-0.016,0.368-0.016,0.73c0,0.792,0.159,1.423,0.478,1.892 c0.318,0.468,0.76,0.702,1.324,0.702c0.513,0,0.93-0.196,1.251-0.59c0.32-0.394,0.481-0.919,0.481-1.577 c0-0.667-0.162-1.189-0.485-1.564c-0.324-0.375-0.761-0.563-1.309-0.563c-0.357,0-0.695,0.094-1.014,0.28 S54.246,24.481,54.09,24.755z").attr({
            fill: '#562E8F',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_e');
        var path_f = rsr.path("M65.484,29.959c-1.326,0-2.368-0.372-3.126-1.114c-0.759-0.743-1.138-1.752-1.138-3.025 c0-1.315,0.393-2.344,1.18-3.087s1.852-1.115,3.192-1.115c1.32,0,2.355,0.372,3.106,1.115s1.126,1.726,1.126,2.947 c0,1.32-0.387,2.363-1.161,3.13C67.891,29.576,66.83,29.959,65.484,29.959z M65.546,23.497c-0.58,0-1.03,0.199-1.352,0.599 c-0.32,0.398-0.481,0.963-0.481,1.692c0,1.527,0.616,2.291,1.849,2.291c1.176,0,1.763-0.784,1.763-2.353 C67.324,24.24,66.731,23.497,65.546,23.497z").attr({
            fill: window.sv.scheme.textDark,
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_f');
        var path_g = rsr.path("M77.142,23.676h-2.129v6.089h-2.47v-6.089H70.4v-1.864h6.741V23.676z").attr({
            fill: window.sv.scheme.textDark,
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_g');
        var path_h = rsr.path("M85.039,29.765h-2.321v-1.142h-0.031c-0.533,0.891-1.323,1.336-2.369,1.336 c-0.771,0-1.378-0.219-1.821-0.656c-0.442-0.438-0.664-1.021-0.664-1.752c0-1.542,0.914-2.433,2.742-2.671l2.158-0.288 c0-0.869-0.471-1.304-1.413-1.304c-0.947,0-1.849,0.281-2.702,0.846v-1.848c0.341-0.176,0.809-0.331,1.401-0.466 s1.133-0.202,1.619-0.202c2.268,0,3.401,1.131,3.401,3.394V29.765z M82.732,26.534v-0.536l-1.444,0.187 c-0.797,0.104-1.195,0.463-1.195,1.079c0,0.28,0.097,0.509,0.291,0.688s0.457,0.268,0.788,0.268c0.461,0,0.836-0.159,1.126-0.478 S82.732,27.021,82.732,26.534z").attr({
            fill: window.sv.scheme.textDark,
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_h');
        var path_i = rsr.path("M95.361,25.998h-2.99v2.99h-1.569v-2.99h-3.005v-1.576h3.005v-3.006h1.569v3.006h2.99V25.998z").attr({
            fill: '#552D90',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_i');
        group_a.attr({'parent': 'Text', 'name': 'group_a'});
        var rsrGroups = [Text, group_a];
        Text.push();
        group_a.push(path_b, path_c, path_d, path_e, path_f, path_g, path_h, path_i);
        /*Scale Raphael Svg Group */

        //group_a.transform('s5');
        var hslColorsInit = [];
        var hslColorsLight = [];
        var step = 3.7;

        for (var i = 0; i < group_a.length; i++) {
            var path = group_a[i];
            var rgb = Raphael.getRGB(path.attrs.fill);
            var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
            hslColorsInit.push(path.attrs.fill);
            var hslLight = (function (hsl) {
                var temp = hsl.constructor();
                for (var key in hsl) {
                    if (hsl.hasOwnProperty(key)) {
                        temp[key] = hsl[key];
                    }
                }
                return temp;
            })(hsl);

            hslLight.l += .2;
            hslLight.s -= 0.1;
            hslColorsLight.push(Raphael.hsl2rgb(hslLight).hex);

            var transPath = i * step;
            path.transform('s1.3,t' + transPath + ',0');
        }
        this.group_a = group_a;

        this.init = hslColorsInit;
        this.light = hslColorsLight;

        return divSat;
    }

    module.exports = saturday;
});
