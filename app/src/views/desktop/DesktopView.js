define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var VideoSurface = require('famous/surfaces/VideoSurface');

    var VideoView = require('dviews/header/VideoView');

    var HeaderView = require('dviews/header/HeaderView');
    var ContentView = require('dviews/content/ContentView');
    var FooterView = require('dviews/footer/FooterView');


    DesktopView.DEFAULT_OPTIONS = {
        centerModifier: [0.5, 0],
        videoUrl: 'https://d2vj41uy1yy43g.cloudfront.net/empire_state.webm',
        layout: {
            headerSize: 200,
            footerSize: 50
        }
    };

    function DesktopView() {
        View.apply(this, arguments);

        _init.call(this);

        _videoBackground.call(this);

        _headerFooterLayout.call(this);
    }

    function _headerFooterLayout() {
        this.layout = new HeaderFooterLayout(this.options.layout);
        this.layout.header = new HeaderView();
        this.rootNode.add(this.layout);
    }

    function _videoBackground() {
        this.videoSurface = new VideoView({
            size: [window.innerWidth, window.innerWidth * .56],
            autoplay: false,
            controls: false
        });
        this.videoSurface.setContent(this.options.videoUrl);

        this.rootNode.add(this.videoSurface);
    }

    function _init() {
        var centerModifier = new Modifier({
            align: this.options.centerModifier,
            origin: this.options.centerModifier,
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(centerModifier);
    }

    DesktopView.prototype = Object.create(View.prototype);
    DesktopView.prototype.constructor = DesktopView;


    module.exports = DesktopView;
});
