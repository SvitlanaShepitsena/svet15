/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name TestView
     * @constructor
     * @description
     */

    function TestView() {
        View.apply(this, arguments);
    }

    TestView.prototype = Object.create(View.prototype);
    TestView.prototype.constructor = TestView;

    TestView.DEFAULT_OPTIONS = {
    };

    module.exports = TestView;
});
