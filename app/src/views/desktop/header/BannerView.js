define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var VideoView = require('dviews/header/VideoView');




    function BannerView() {
        View.apply(this, arguments);
        _init.call(this);
        _addBanner.call(this);


    }


    function _addBanner() {
        var videoView = new VideoView();
        this.rootNode.add(videoView);
    }

    function _init() {
        var alighTopModifier = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.rootNode = this.add(alighTopModifier);

    }
    BannerView.prototype = Object.create(View.prototype);
    BannerView.prototype.constructor = BannerView;

    BannerView.DEFAULT_OPTIONS = {};

    module.exports = BannerView;
});
