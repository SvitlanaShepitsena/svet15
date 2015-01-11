define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    function DeskScroll() {
        View.apply(this, arguments);

        _init.call(this);
    }
        function _init() {
            this.centerModifier = new Modifier({
                align: [0.5, 0.5],
                origin: [0.5, 0.5],
                transform: Transform.translate(0, 0, 0)
            });
            this.rootNode = this.add(this.centerModifier);
        }

    DeskScroll.prototype = Object.create(View.prototype);
    DeskScroll.prototype.constructor = DeskScroll;

    DeskScroll.DEFAULT_OPTIONS = {};

    module.exports = DeskScroll;
});
