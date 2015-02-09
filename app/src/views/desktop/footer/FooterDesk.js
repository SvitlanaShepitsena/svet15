define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function FooterDesk() {
        View.apply(this, arguments);
        _init.call(this);
        _footer.call(this);
    }

    function _footer() {
        this.mapSurface = new Surface({
            size: [undefined, undefined],
            content: "Footer Surface",
            properties: {
                backgroundColor: 'MediumSlateBlue',
                textAlign: "center"
            }
        });
        this.rootNode.add(this.mapSurface);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    FooterDesk.prototype = Object.create(View.prototype);
    FooterDesk.prototype.constructor = FooterDesk;

    FooterDesk.DEFAULT_OPTIONS = {};

    module.exports = FooterDesk;
});
