define(function (require, exports, module) {
    var VideoSurface = require('famous/surfaces/VideoSurface');

    VideoExtraSurfaceDesk.prototype = Object.create(VideoSurface.prototype);
    VideoExtraSurfaceDesk.prototype.constructor = VideoExtraSurfaceDesk;

    function VideoExtraSurfaceDesk(options) {
        VideoSurface.apply(this, arguments);
        this.options.controls = options && options.controls ? options.controls : false;
        this._superDeploy = VideoSurface.prototype.deploy;
    }


    VideoExtraSurfaceDesk.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        target.controls = this.options.controls;

        this._videoElement = target;
    }

    VideoExtraSurfaceDesk.prototype.play = function play() {
        return this._videoElement.play();
    }

    VideoExtraSurfaceDesk.prototype.pause = function pause() {
        return this._videoElement.pause();
    }

    module.exports = VideoExtraSurfaceDesk;
});
