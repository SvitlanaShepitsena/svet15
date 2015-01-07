/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name YoView
     * @constructor
     * @description
     */

    function YoView() {
        View.apply(this, arguments);
    }

    YoView.prototype = Object.create(View.prototype);
    YoView.prototype.constructor = YoView;

    YoView.DEFAULT_OPTIONS = {
    };

    module.exports = YoView;
});
