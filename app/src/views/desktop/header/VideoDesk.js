define(function (require, exports, module) {
    var VideoSurface = require('famous/surfaces/VideoSurface');


    function VideoDesk(options) {
        VideoSurface.apply(this, arguments);

        this.options.controls = options && options.controls ? options.controls : false;
        this._superDeploy = VideoSurface.prototype.deploy;
    }

    VideoDesk.prototype = Object.create(VideoSurface.prototype);
    VideoDesk.prototype.constructor = VideoDesk;

    VideoDesk.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        target.controls = this.options.controls;

        this.videoElement = target;
        setInterval(function () {
            //this.play();
        }.bind(this), 44000);
    }

    VideoDesk.prototype.play = function play() {
        this.videoElement.play();
    }

    VideoDesk.DEFAULT_OPTIONS = {};

    module.exports = VideoDesk;
});
