define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    function RadioScrollDesk() {
        ScrollContainer.apply(this, arguments);
        _scrollRadio.call(this);
    }

    function _scrollRadio() {

        var surfaces = [];
        this.scrollview.setOptions({
          direction:0
        })
        this.scrollview.sequenceFrom(surfaces);


        var n = 5;

        for (var i = 0, appSurface; i < n; i++) {
            appSurface = new Surface({
                content: "Surface: " + (i + 1),
                size: [500, 350],
                properties: {
                    backgroundColor: "hsl(" + (i * 360 / n) + ", 70%, 75%)",
                    textAlign: "center"
                }
            });

            appSurface.pipe(this.scrollview);
            surfaces.push(appSurface);
        }



    }



    RadioScrollDesk.prototype = Object.create(ScrollContainer.prototype);
    RadioScrollDesk.prototype.constructor = RadioScrollDesk;

    RadioScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = RadioScrollDesk;
});
