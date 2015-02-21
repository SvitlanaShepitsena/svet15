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
        this.border = '1px solid #E5E5E5',
            View.apply(this, arguments);
        _init.call(this);
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
        this.rootNode.add(this.surface);
    }

    function _saturdaySvg() {
        var divSat = document.createElement('div');
        var paper = Raphael(divSat, '140', '100');

        var path_a = paper.path("M25.979,12.896,5.979,12.896,5.979,19.562,25.979,19.562z");
        path_a.attr({
            fill: this.purple,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_a');
        var path_b = paper.path("M9.562,12.597c-0.813,0.394-1.875,0.591-3.185,0.591c-1.709,0-3.052-0.502-4.03-1.507 S0.879,9.338,0.879,7.665c0-1.781,0.55-3.225,1.649-4.333C3.629,2.224,5.057,1.67,6.812,1.67c1.088,0,2.004,0.137,2.75,0.412v2.415 C8.815,4.052,7.967,3.829,7.014,3.829c-1.046,0-1.89,0.329-2.531,0.986C3.84,5.473,3.519,6.363,3.519,7.487 c0,1.076,0.304,1.935,0.909,2.574s1.421,0.959,2.446,0.959c0.979,0,1.874-0.238,2.688-0.715V12.597z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_b');
        var path_c = paper.path("M17.752,5.041l-3.074,8.17c-0.901,1.736-1.854,2.279-3.354,2.336H9.277l0.266-1.73 c1.391,0.35,2.047,0.256,2.804-0.839L9.115,5.041h2.719c0,0,1.648,5.494,1.7,5.902h0.031c0.047-0.3,1.755-5.902,1.755-5.902H17.752 z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_c');
        var path_d = paper.path("M24.483,1.033v1.941c-0.249,0.191-0.58,0.318-0.994,0.38c-1.165,0.182-1.861,0.298-2.089,0.35 c-0.472,0.109-0.814,0.256-1.029,0.443c-0.215,0.186-0.391,0.458-0.528,0.815c-0.137,0.357-0.231,0.792-0.283,1.305h0.031 c0.59-0.678,1.379-1.018,2.368-1.018c1.129,0,2.008,0.335,2.637,1.006c0.629,0.671,0.943,1.596,0.943,2.776 c0,1.264-0.386,2.271-1.157,3.025c-0.771,0.753-1.816,1.13-3.137,1.13c-1.383,0-2.434-0.44-3.153-1.32s-1.08-2.154-1.08-3.821 c0-0.797,0.06-1.518,0.179-2.163s0.298-1.214,0.536-1.709c0.238-0.494,0.532-0.907,0.882-1.239 c0.349-0.331,0.706-0.573,1.071-0.726c0.365-0.152,0.724-0.267,1.076-0.342c0.352-0.075,1.234-0.221,2.647-0.438 C23.87,1.31,24.229,1.178,24.483,1.033z M19.52,7.983c-0.011,0.125-0.016,0.368-0.016,0.73c0,0.792,0.159,1.423,0.478,1.892 c0.318,0.468,0.76,0.702,1.324,0.702c0.513,0,0.93-0.196,1.251-0.59c0.32-0.394,0.481-0.919,0.481-1.577 c0-0.667-0.162-1.189-0.485-1.564c-0.324-0.375-0.761-0.563-1.309-0.563c-0.357,0-0.695,0.094-1.014,0.28S19.675,7.71,19.52,7.983z ").attr({
            fill: this.grey,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_d');
        var path_e = paper.path("M32.651,1.033v1.941c-0.249,0.191-0.58,0.318-0.994,0.38c-1.165,0.182-1.861,0.298-2.089,0.35 c-0.472,0.109-0.814,0.256-1.029,0.443c-0.215,0.186-0.391,0.458-0.528,0.815c-0.137,0.357-0.231,0.792-0.283,1.305h0.031 c0.59-0.678,1.379-1.018,2.368-1.018c1.129,0,2.008,0.335,2.637,1.006c0.629,0.671,0.943,1.596,0.943,2.776 c0,1.264-0.386,2.271-1.157,3.025c-0.771,0.753-1.816,1.13-3.137,1.13c-1.383,0-2.434-0.44-3.153-1.32s-1.08-2.154-1.08-3.821 c0-0.797,0.06-1.518,0.179-2.163s0.298-1.214,0.536-1.709c0.238-0.494,0.532-0.907,0.882-1.239 c0.349-0.331,0.706-0.573,1.071-0.726c0.365-0.152,0.724-0.267,1.076-0.342c0.352-0.075,1.234-0.221,2.647-0.438 C32.038,1.31,32.397,1.178,32.651,1.033z M27.688,7.983c-0.011,0.125-0.016,0.368-0.016,0.73c0,0.792,0.159,1.423,0.478,1.892 c0.318,0.468,0.76,0.702,1.324,0.702c0.513,0,0.93-0.196,1.251-0.59c0.32-0.394,0.481-0.919,0.481-1.577 c0-0.667-0.162-1.189-0.485-1.564c-0.324-0.375-0.761-0.563-1.309-0.563c-0.357,0-0.695,0.094-1.014,0.28S27.844,7.71,27.688,7.983 z").attr({
            fill: '#562E8F',
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_e');
        var path_f = paper.path("M37.458,13.188c-1.326,0-2.368-0.372-3.126-1.114c-0.759-0.743-1.138-1.752-1.138-3.025 c0-1.315,0.393-2.344,1.18-3.087s1.852-1.115,3.192-1.115c1.321,0,2.356,0.372,3.106,1.115c0.752,0.743,1.127,1.726,1.127,2.947 c0,1.32-0.387,2.363-1.162,3.13C39.863,12.805,38.803,13.188,37.458,13.188z M37.519,6.726c-0.58,0-1.03,0.199-1.352,0.599 c-0.32,0.398-0.481,0.963-0.481,1.692c0,1.527,0.616,2.291,1.849,2.291c1.176,0,1.762-0.784,1.762-2.353 C39.297,7.469,38.705,6.726,37.519,6.726z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_f');
        var path_g = paper.path("M54.916,12.993h-2.321v-1.142h-0.031c-0.533,0.891-1.323,1.336-2.369,1.336 c-0.771,0-1.378-0.219-1.821-0.656c-0.442-0.438-0.664-1.021-0.664-1.752c0-1.542,0.914-2.433,2.742-2.671l2.158-0.288 c0-0.869-0.471-1.304-1.413-1.304c-0.947,0-1.849,0.281-2.702,0.846V5.514c0.341-0.176,0.809-0.331,1.401-0.466 s1.133-0.202,1.619-0.202c2.268,0,3.401,1.131,3.401,3.394V12.993z M52.609,9.763V9.227l-1.444,0.187 c-0.797,0.104-1.195,0.463-1.195,1.079c0,0.28,0.097,0.509,0.291,0.688s0.457,0.268,0.788,0.268c0.461,0,0.836-0.159,1.126-0.478 S52.609,10.249,52.609,9.763z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_g');
        var path_h = paper.path("M 41.023,5.041 41.023,6.904 43.563,6.904 43.563,12.993 46.032,12.993 46.032,6.904 48.563,6.904 48.563,5.041 z").attr({
            fill: this.grey,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_h');
        var path_i = paper.path("M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z").attr({
            fill: this.purple,
            parent: 'group',
            'stroke': 'none'
        }).data('id', 'path_i');
        path_a.transform('...s3.2,0.5, 0,0, t-24.5,20');
        path_i.transform('...s0.46,0.46, 0,0, t175,8');

        var group = paper.set();
        group.attr({'id': 'group', 'name': 'group'});
        var rsrGroups = [group];
        group.push(path_a, path_b, path_c, path_d, path_e, path_f, path_g, path_h, path_i);
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
