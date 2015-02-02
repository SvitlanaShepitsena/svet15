define(function (require, exports, module) {
    var VideoSurface = require('famous/surfaces/VideoSurface');

    function VideoExtraSurface(options) {
        VideoSurface.apply(this, arguments);
        this.options.controls = options && options.controls ? options.controls : false;
        this._superDeploy = VideoSurface.prototype.deploy;

    }

    VideoExtraSurface.prototype = Object.create(VideoSurface.prototype);
    VideoExtraSurface.prototype.constructor = VideoExtraSurface;

    VideoExtraSurface.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        target.controls = this.options.controls;

        this._videoElement = target;
    }

    VideoExtraSurface.prototype.play = function play() {
        return this._videoElement.play();
    }

    VideoExtraSurface.prototype.pause = function pause() {
        return this._videoElement.pause();
    }

    module.exports = VideoExtraSurface;
});
