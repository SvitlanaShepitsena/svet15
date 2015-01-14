define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function FooterCell() {
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

    FooterCell.prototype = Object.create(View.prototype);
    FooterCell.prototype.constructor = FooterCell;

    FooterCell.DEFAULT_OPTIONS = {};

    module.exports = FooterCell;
});
