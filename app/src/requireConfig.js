require.config({
    paths: {
        requirejs: '../lib/requirejs/require',
        famous: '../lib/famous/src/',
        d3: '../lib/d3/',
        jade: '../jade/'
    }
});
require(['main']);
