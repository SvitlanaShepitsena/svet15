require.config({
    paths: {
        famous: "../lib/famous/src",
        famousimg: "../lib/famous-bkimagesurface",
        coord: "../src/views/misc/map",
        fmaps: "../lib/famous-map/",
        flex: "../lib/famous-flex/",
        requirejs: "../lib/requirejs/require",
        views: "views",
        dviews: "views/desktop",
        cviews: "views/cell",
        jade: "../jade",
        radio: "views/desktop/content/radio/audio",
        almond: "../lib/almond/almond"
    }
});
require(['main']);
