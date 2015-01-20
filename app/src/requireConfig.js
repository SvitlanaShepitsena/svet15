require.config({
    paths: {
        famous: "../lib/famous/src",
        coord: "../src/views/misc/map",
        fmaps: "../lib/famous-map/",
        requirejs: "../lib/requirejs/require",
        views: "views",
        dviews: "views/desktop",
        cviews: "views/cell",
        jade: "../jade",
        almond: "../lib/almond/almond"
    }
});
require(['main']);
