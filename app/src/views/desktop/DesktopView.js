define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var BannerView = require('dviews/header/BannerView');

    function DesktopView() {
        View.apply(this, arguments);

        _init.call(this);
        var bannerView = new BannerView();
        this.rootNode.add(bannerView);

    }

    function _init() {
        var centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(centerModifier);
    }

    DesktopView.prototype = Object.create(View.prototype);
    DesktopView.prototype.constructor = DesktopView;

    DesktopView.DEFAULT_OPTIONS = {};

    module.exports = DesktopView;
});
