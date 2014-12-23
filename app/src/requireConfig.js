/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: "../lib/famous/src",
        requirejs: "../lib/requirejs/require",
        views: "../views",
        almond: "../lib/almond/almond"
    },
    packages: [

    ]
});
require(['main']);
