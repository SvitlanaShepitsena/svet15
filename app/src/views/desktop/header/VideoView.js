define(function(require, exports, module) {
    var View = require('famous/core/View');
    var VideoSurface = require('famous/surfaces/VideoSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');


    function VideoView() {
        View.apply(this, arguments);

        this.videoBanner = new VideoSurface({
            autoplay: true,
            controls: false
        });
        this.videoBanner.setContent('https://d2vj41uy1yy43g.cloudfront.net/empire_state.webm');
        this.add(this.videoBanner);
    }

    VideoView.prototype = Object.create(View.prototype);
    VideoView.prototype.constructor = VideoView;

    VideoView.DEFAULT_OPTIONS = {
    };

    module.exports = VideoView;
});
