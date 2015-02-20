define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    newLight.prototype = Object.create(View.prototype);
    newLight.prototype.constructor = newLight;
    newLight.DEFAULT_OPTIONS = {
        surfopts: {
            color: 'white',
            textAlign: 'center',
            backgroundColor: '#FA5C4F'
        }
    };

    function newLight() {
        View.apply(this, arguments);
        _init.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [200, 30],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.surface = new Surface({
            content: _newLightSvg.call(this),
            properties: {
                backgroundColor: 'blue'
            }

        });
        this.surface.pipe(this._eventOutput);

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    function _newLightSvg() {

        var divNewLight = document.createElement('div');
        var rsr = Raphael(divNewLight, '200', '30');
        var Text = rsr.set();
        var path_a = rsr.path("M15.107,32.034h-2.415v-4.353H8.266v4.353H5.858V21.347h2.407v4.264h4.427v-4.264h2.415V32.034z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_a');
        var path_b = rsr.path("M22.068,32.221c-1.53,0-2.777-0.498-3.741-1.494c-0.964-0.996-1.446-2.295-1.446-3.895 c0-1.688,0.49-3.056,1.468-4.099c0.979-1.044,2.276-1.565,3.891-1.565c1.525,0,2.759,0.5,3.7,1.498 c0.941,0.999,1.413,2.315,1.413,3.95c0,1.68-0.488,3.033-1.465,4.062C24.912,31.706,23.638,32.221,22.068,32.221z M22.173,23.24 c-0.845,0-1.516,0.316-2.013,0.95c-0.497,0.634-0.745,1.472-0.745,2.516c0,1.058,0.249,1.896,0.745,2.511 c0.497,0.616,1.148,0.925,1.953,0.925c0.83,0,1.488-0.3,1.975-0.898s0.73-1.43,0.73-2.493c0-1.107-0.236-1.97-0.708-2.586 S22.993,23.24,22.173,23.24z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_b');
        var path_c = rsr.path("M29.126,32.034V21.347h3.891c1.192,0,2.109,0.219,2.75,0.656s0.961,1.054,0.961,1.849 c0,0.576-0.195,1.08-0.585,1.513c-0.39,0.432-0.888,0.732-1.495,0.901v0.03c0.76,0.095,1.368,0.375,1.822,0.842 s0.682,1.036,0.682,1.706c0,0.979-0.35,1.756-1.051,2.33c-0.701,0.573-1.657,0.86-2.87,0.86H29.126z M31.533,23.121v2.533h1.059 c0.497,0,0.888-0.12,1.174-0.361c0.286-0.24,0.428-0.572,0.428-0.994c0-0.785-0.586-1.178-1.759-1.178H31.533z M31.533,27.443 v2.817h1.304c0.557,0,0.993-0.13,1.308-0.388c0.315-0.259,0.473-0.611,0.473-1.059c0-0.427-0.155-0.763-0.466-1.006 s-0.744-0.365-1.3-0.365H31.533z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_c');
        var path_d = rsr.path("M38.912,32.034V21.347h2.407v4.003h1.573c2.579,0,3.868,1.048,3.868,3.145c0,1.118-0.348,1.987-1.043,2.608 c-0.696,0.621-1.677,0.932-2.944,0.932H38.912z M41.319,27.168v3.033h1.088c1.212,0,1.818-0.515,1.818-1.543 c0-0.993-0.591-1.49-1.774-1.49H41.319z M50.173,32.034h-2.392V21.347h2.392V32.034z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_d');
        var path_e = rsr.path("M80.115,22.765c0.229-0.231,0.481-0.427,0.741-0.607H70.382v0.806h9.573 C80.013,22.899,80.055,22.826,80.115,22.765z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_e');
        var path_f = rsr.path("M79.349,23.769h-8.967v0.805h8.561C79.052,24.289,79.194,24.024,79.349,23.769z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_f');
        var path_g = rsr.path("M78.718,25.379h-8.336v0.806h8.209C78.619,25.907,78.659,25.637,78.718,25.379z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_g');
        var path_h = rsr.path("M88.728,32.035V21.349h3.891c1.191,0,2.108,0.219,2.75,0.655c0.641,0.438,0.961,1.054,0.961,1.849 c0,0.576-0.195,1.081-0.585,1.513c-0.39,0.433-0.888,0.733-1.495,0.902v0.029c0.761,0.095,1.368,0.376,1.822,0.843 c0.455,0.467,0.683,1.036,0.683,1.706c0,0.979-0.351,1.756-1.051,2.329s-1.657,0.86-2.87,0.86H88.728z M91.134,23.122v2.534h1.059 c0.497,0,0.889-0.12,1.174-0.361c0.286-0.241,0.429-0.572,0.429-0.995c0-0.785-0.586-1.178-1.759-1.178H91.134z M91.134,27.445 v2.816h1.305c0.557,0,0.992-0.129,1.309-0.387c0.314-0.259,0.473-0.611,0.473-1.059c0-0.428-0.155-0.763-0.466-1.006 c-0.311-0.244-0.744-0.365-1.3-0.365H91.134z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_h');
        var path_i = rsr.path("M104.923,32.035h-6.41V21.349h6.164v1.96h-3.757v2.378h3.495v1.952h-3.495v2.444h4.003V32.035z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_i');
        var path_j = rsr.path("M114.142,23.309h-3.049v8.727h-2.414v-8.727h-3.033v-1.96h8.496V23.309z").attr({
            fill: '#FCFAFC',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_j');
        var path_k = rsr.path("M55.286,19.663c0.591,0.467,1.332,0.7,2.221,0.7c0.874,0,1.606-0.233,2.198-0.7 c0.592-0.468,0.932-1.096,1.021-1.886h-1.715c-0.029,0.377-0.186,0.69-0.469,0.938c-0.283,0.249-0.619,0.373-1.006,0.373 c-0.393,0-0.733-0.123-1.021-0.369c-0.289-0.246-0.445-0.56-0.47-0.942h-1.714C54.376,18.567,54.694,19.195,55.286,19.663z").attr({
            fill: '#FFFFFF',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_k');
        var path_l = rsr.path("M82.288,32.035c0.47,0.113,0.968,0.188,1.52,0.188c1.258,0,2.275-0.189,3.057-0.566v-2.199 c-0.781,0.457-1.641,0.686-2.579,0.686c-0.983,0-1.767-0.307-2.348-0.92c-0.581-0.614-0.872-1.438-0.872-2.471 c0-1.078,0.309-1.933,0.924-2.563c0.616-0.632,1.426-0.947,2.43-0.947c0.914,0,1.729,0.214,2.445,0.642v-2.318 c-0.716-0.263-1.596-0.395-2.639-0.395c-0.54,0-1.038,0.07-1.513,0.182L59.66,21.347l-4.24,6.507 c-0.343,0.521-0.527,0.813-0.551,0.871h-0.03c0.04-0.248,0.06-0.737,0.06-1.468v-5.91h-2.273v10.688h2.422l4.412-6.715 c0.254-0.388,0.434-0.683,0.537-0.887h0.045c-0.051,0.477-0.074,1.054-0.074,1.729v5.873").attr({
            fill: '#FFFFFF',
            parent: 'Text',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_l');
        Text.attr({'id': 'Text', 'name': 'Text'});
        var Red_lines = rsr.set();
        var path_m = rsr.path("M62.221,31.176v0.86h20.058c-0.706-0.164-1.323-0.451-1.852-0.86H62.221z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_m');
        var path_n = rsr.path("M62.221,30.318H79.58c-0.202-0.267-0.374-0.553-0.517-0.86H62.221V30.318z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_n');
        var path_o = rsr.path("M62.221,27.795V28.6h16.536c-0.067-0.258-0.124-0.523-0.158-0.805H62.221z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_o');
        var path_p = rsr.path("M78.591,26.185h-8.209v0.805h8.154c0-0.023-0.005-0.043-0.005-0.066 C78.531,26.665,78.567,26.428,78.591,26.185z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_p');
        var path_q = rsr.path("M78.942,24.573h-8.561v0.806h8.336C78.78,25.103,78.844,24.827,78.942,24.573z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_q');
        var path_r = rsr.path("M79.955,22.963h-9.573v0.806h8.967C79.521,23.481,79.727,23.215,79.955,22.963z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_r');
        var path_s = rsr.path("M80.856,22.157c0.511-0.357,1.088-0.603,1.715-0.764v-0.042H70.382v0.806H80.856z").attr({
            fill: '#BF2033',
            parent: 'Red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_s');
        Red_lines.attr({'id': 'Red_lines', 'name': 'Red_lines'});
        var Banner_stars = rsr.set();
        Banner_stars.attr({'id': 'Banner_stars', 'name': 'Banner_stars'});
        var layer5 = rsr.set();
        var rect8796 = rsr.rect(62.221, 21.347, 8.161, 5.639).attr({
            id: 'rect8796',
            x: '62.221',
            y: '21.347',
            fill: '#213065',
            label: 'field',
            groupmode: 'layer',
            parent: 'Banner_stars',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'rect8796');
        layer5.attr({
            'id': 'layer5',
            'inkscape:label': 'field',
            'inkscape:groupmode': 'layer',
            'parent': 'Banner_stars',
            'name': 'layer5'
        });
        var rsrGroups = [Text, Red_lines, Banner_stars, layer5];
        Text.push(path_a, path_b, path_c, path_d, path_e, path_f, path_g, path_h, path_i, path_j, path_k, path_l);
        Red_lines.push(path_m, path_n, path_o, path_p, path_q, path_r, path_s);
        Banner_stars.push();
        layer5.push(rect8796);
        var group = rsr.set();

        var step = 3.5;
        for (var i = 0; i < rsrGroups.length; i++) {
            var arr = rsrGroups[i];
            for (var j = 0; j < arr.length; j++) {
                var path = arr[j];
                var transPath = j * step;
                //path.transform('t' + transPath + ',-7');
                path.transform('...s1.5,1.5, 0,0 t0,-14');
            }


        }
        return divNewLight;
    }

    module.exports = newLight;
});
