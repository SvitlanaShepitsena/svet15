define(function (require, exports, module) {
    var VideoSurface = require('famous/surfaces/VideoSurface');


    function VideoView(options) {
        VideoSurface.apply(this, arguments);

        this.options.controls = options && options.controls ? options.controls : false;
        this._superDeploy = VideoSurface.prototype.deploy;
    }

    VideoView.prototype = Object.create(VideoSurface.prototype);
    VideoView.prototype.constructor = VideoView;

    VideoView.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        target.controls = this.options.controls;

        this.videoElement = target;
        setInterval(function () {
            //this.play();
        }.bind(this), 44000);
    }

    VideoView.prototype.play = function play() {
        this.videoElement.play();
    }

    VideoView.DEFAULT_OPTIONS = {};

    module.exports = VideoView;
});
