var rsr = Raphael('rsr', '120', '50');
var group_a = rsr.set();
var rect_b = rsr.rect(0, 12.542, 120, 24.917).attr({
    y: '12.542',
    fill: '#314D9B',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'rect_b');
var path_c = rsr.path("M15.107,32.034h-2.415v-4.353H8.266v4.353H5.858V21.347h2.407v4.264h4.427v-4.264h2.415V32.034z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_c');
var path_d = rsr.path("M22.068,32.221c-1.53,0-2.777-0.498-3.741-1.494s-1.446-2.294-1.446-3.895c0-1.688,0.49-3.055,1.468-4.099 c0.979-1.043,2.276-1.566,3.891-1.566c1.526,0,2.759,0.5,3.7,1.498c0.941,1,1.413,2.315,1.413,3.951 c0,1.681-0.488,3.034-1.465,4.062C24.912,31.706,23.638,32.221,22.068,32.221z M22.173,23.24c-0.845,0-1.516,0.317-2.013,0.951 c-0.496,0.634-0.744,1.471-0.744,2.515c0,1.058,0.248,1.895,0.744,2.511c0.498,0.616,1.149,0.925,1.954,0.925 c0.83,0,1.487-0.299,1.975-0.898s0.73-1.43,0.73-2.494c0-1.106-0.236-1.969-0.708-2.584C23.638,23.547,22.993,23.24,22.173,23.24z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_d');
var path_e = rsr.path("M29.126,32.034V21.347h3.891c1.193,0,2.109,0.219,2.75,0.656c0.641,0.437,0.961,1.054,0.961,1.849 c0,0.576-0.195,1.08-0.585,1.513c-0.39,0.432-0.888,0.732-1.495,0.9v0.031c0.76,0.095,1.368,0.375,1.822,0.843 c0.455,0.466,0.682,1.035,0.682,1.704c0,0.98-0.35,1.757-1.05,2.331c-0.701,0.572-1.658,0.86-2.87,0.86H29.126z M31.533,23.121 v2.534h1.059c0.497,0,0.888-0.121,1.174-0.361s0.428-0.573,0.428-0.995c0-0.785-0.586-1.178-1.759-1.178H31.533z M31.533,27.442 v2.817h1.305c0.557,0,0.993-0.128,1.308-0.387s0.474-0.612,0.474-1.059c0-0.427-0.156-0.763-0.467-1.007 c-0.31-0.242-0.744-0.365-1.3-0.365H31.533z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_e');
var path_f = rsr.path("M38.912,32.034V21.347h2.407v4.002h1.573c2.579,0,3.869,1.048,3.869,3.145c0,1.118-0.349,1.987-1.043,2.608 c-0.696,0.62-1.678,0.932-2.944,0.932H38.912z M41.319,27.167v3.034h1.088c1.212,0,1.818-0.516,1.818-1.543 c0-0.993-0.592-1.491-1.774-1.491H41.319z M50.173,32.034h-2.392V21.347h2.392V32.034z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_f');
var path_g = rsr.path("M80.115,22.765c0.229-0.232,0.481-0.427,0.741-0.607H70.382v0.806h9.573 C80.013,22.899,80.055,22.826,80.115,22.765z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_g');
var path_h = rsr.path("M79.349,23.769h-8.967v0.804h8.561C79.052,24.289,79.194,24.024,79.349,23.769z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_h');
var path_i = rsr.path("M78.718,25.379h-8.336v0.805h8.209C78.619,25.907,78.659,25.637,78.718,25.379z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_i');
var path_j = rsr.path("M88.728,32.036V21.348h3.891c1.191,0,2.108,0.219,2.749,0.656c0.641,0.437,0.962,1.053,0.962,1.849 c0,0.576-0.195,1.081-0.585,1.513c-0.389,0.432-0.887,0.733-1.495,0.902v0.029c0.76,0.094,1.367,0.376,1.823,0.843 c0.453,0.467,0.682,1.036,0.682,1.706c0,0.979-0.352,1.756-1.052,2.329c-0.698,0.573-1.656,0.861-2.87,0.861H88.728z M91.135,23.123v2.534h1.059c0.496,0,0.888-0.121,1.173-0.361c0.287-0.241,0.43-0.573,0.43-0.995c0-0.786-0.587-1.177-1.759-1.177 H91.135z M91.135,27.445v2.816h1.303c0.559,0,0.993-0.129,1.31-0.386c0.314-0.259,0.474-0.612,0.474-1.06 c0-0.427-0.156-0.762-0.467-1.006c-0.31-0.245-0.744-0.365-1.299-0.365H91.135z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_j');
var path_k = rsr.path("M104.923,32.036h-6.41V21.348h6.164v1.961h-3.757v2.377h3.495v1.953h-3.495v2.443h4.003V32.036z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_k');
var path_l = rsr.path("M114.143,23.309h-3.051v8.727h-2.413v-8.727h-3.033v-1.961h8.497V23.309z").attr({
    fill: '#FCFAFC',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_l');
var path_m = rsr.path("M55.286,19.663c0.591,0.467,1.331,0.7,2.221,0.7c0.874,0,1.607-0.233,2.198-0.7 c0.592-0.468,0.932-1.095,1.021-1.885h-1.715c-0.029,0.377-0.185,0.69-0.469,0.938c-0.283,0.25-0.62,0.374-1.005,0.374 c-0.394,0-0.733-0.124-1.022-0.37c-0.289-0.247-0.445-0.56-0.47-0.942h-1.714C54.377,18.567,54.694,19.195,55.286,19.663z").attr({
    fill: '#FFFFFF',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_m');
var path_n = rsr.path("M82.288,32.036c0.47,0.111,0.968,0.187,1.52,0.187c1.258,0,2.275-0.189,3.057-0.566v-2.198 c-0.781,0.456-1.641,0.685-2.579,0.685c-0.983,0-1.767-0.308-2.348-0.92c-0.581-0.614-0.872-1.438-0.872-2.471 c0-1.078,0.309-1.933,0.924-2.564c0.616-0.631,1.426-0.947,2.43-0.947c0.914,0,1.729,0.213,2.445,0.642v-2.319 c-0.716-0.263-1.596-0.394-2.639-0.394c-0.54,0-1.038,0.07-1.513,0.181L59.66,21.347l-4.24,6.507 c-0.343,0.521-0.527,0.813-0.552,0.871h-0.03c0.04-0.248,0.06-0.736,0.06-1.468v-5.91h-2.273v10.688h2.422l4.412-6.714 c0.254-0.389,0.434-0.684,0.537-0.887h0.045c-0.051,0.476-0.074,1.053-0.074,1.729v5.873").attr({
    fill: '#FFFFFF',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_n');
var path_o = rsr.path("M62.221,31.177v0.859h20.058c-0.706-0.164-1.323-0.451-1.852-0.859H62.221z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_o');
var path_p = rsr.path("M62.221,30.318H79.58c-0.202-0.268-0.374-0.552-0.517-0.86H62.221V30.318z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_p');
var path_q = rsr.path("M62.221,27.796V28.6h16.536c-0.067-0.258-0.124-0.523-0.158-0.804H62.221z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_q');
var path_r = rsr.path("M78.591,26.185h-8.209v0.805h8.154c0-0.024-0.005-0.043-0.005-0.066 C78.531,26.665,78.567,26.429,78.591,26.185z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_r');
var path_s = rsr.path("M78.942,24.573h-8.561v0.807h8.336C78.78,25.103,78.844,24.827,78.942,24.573z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_s');
var path_t = rsr.path("M79.955,22.963h-9.573v0.805h8.967C79.521,23.481,79.727,23.215,79.955,22.963z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_t');
var path_u = rsr.path("M80.856,22.158c0.511-0.358,1.088-0.603,1.715-0.764v-0.043H70.382v0.807H80.856z").attr({
    fill: '#BF2033',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'path_u');
group_a.attr({'name': 'group_a'});
var layer5 = rsr.set();
var rect8796 = rsr.rect(62.221, 21.347, 8.161, 5.638).attr({
    id: 'rect8796',
    x: '62.221',
    y: '21.347',
    fill: '#213065',
    label: 'field',
    groupmode: 'layer',
    parent: 'group_a',
    'stroke-width': '0',
    'stroke-opacity': '1'
}).data('id', 'rect8796');
layer5.attr({
    'id': 'layer5',
    'inkscape:label': 'field',
    'inkscape:groupmode': 'layer',
    'parent': 'group_a',
    'name': 'layer5'
});
var rsrGroups = [group_a, layer5];
group_a.push(rect_b, path_c, path_d, path_e, path_f, path_g, path_h, path_i, path_j, path_k, path_l, path_m, path_n, path_o, path_p, path_q, path_r, path_s, path_t, path_u);
layer5.push(rect8796);
COPY
THE
CODE
Beta
2
feedback
Just
a
few
things
...
