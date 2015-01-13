define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var DeskScroll = require('dviews/content/ScrollDesk');
    var VideoSurface = require('famous/surfaces/VideoSurface');

    var VideoDesk = require('dviews/header/VideoDesk');

    var HeaderDesk = require('dviews/header/HeaderDesk');
    var FooterDesk = require('dviews/footer/FooterDesk');


    AppViewDesk.DEFAULT_OPTIONS = {
        centerModifier: [0.5, 0],
        videoUrl: 'https://d2vj41uy1yy43g.cloudfront.net/empire_state.webm',
        layout: {
            headerSize: 200,
            footerSize: 50
        }
    };

    function AppViewDesk() {
        View.apply(this, arguments);

        _init.call(this);

        _videoBackground.call(this);

        _headerFooterLayout.call(this);
    }

    function _headerFooterLayout() {
        this.layout = new HeaderFooterLayout(this.options.layout);
        this.layout.header = new HeaderDesk();

        this.layout.content = new DeskScroll();
        this.layout.footer = new FooterDesk();

        this.rootNode.add(this.layout);
    }

    function _videoBackground() {
        this.videoSurface = new VideoDesk({
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

    AppViewDesk.prototype = Object.create(View.prototype);
    AppViewDesk.prototype.constructor = AppViewDesk;


    module.exports = AppViewDesk;
});
