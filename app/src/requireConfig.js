require.config({
    paths: {
        famous: "../lib/famous/src",
        requirejs: "../lib/requirejs/require",
        views: "views",
        dviews: "views/desktop",
        jade: "../jade",
        almond: "../lib/almond/almond"
    }
});
require(['main']);
