define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    vari.prototype = Object.create(View.prototype);
    vari.prototype.constructor = vari;
    vari.DEFAULT_OPTIONS = {};
    function vari(options) {
        View.apply(this, arguments);
        //this.add(yourstuff);
    }

    module.exports = vari;
});
