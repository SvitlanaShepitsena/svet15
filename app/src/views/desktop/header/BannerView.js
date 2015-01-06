define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');


    function BannerView() {
        View.apply(this, arguments);
    }

    BannerView.prototype = Object.create(View.prototype);
    BannerView.prototype.constructor = BannerView;

    BannerView.DEFAULT_OPTIONS = {
    };

    module.exports = BannerView;
});
