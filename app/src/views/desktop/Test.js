define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');


    function Test() {
        View.apply(this, arguments);
    }

    Test.prototype = Object.create(View.prototype);
    Test.prototype.constructor = Test;

    Test.DEFAULT_OPTIONS = {
    };

    module.exports = Test;
});
