define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');


    function DesktopView() {
        View.apply(this, arguments);
    }

    DesktopView.prototype = Object.create(View.prototype);
    DesktopView.prototype.constructor = DesktopView;

    DesktopView.DEFAULT_OPTIONS = {
    };

    module.exports = DesktopView;
});
