define(function (require, exports, module) {
    var VideoSurface = require('famous/surfaces/VideoSurface');

    VideoExtraSurfaceCell.prototype = Object.create(VideoSurface.prototype);
    VideoExtraSurfaceCell.prototype.constructor = VideoExtraSurfaceCell;

    function VideoExtraSurfaceCell(options) {
        VideoSurface.apply(this, arguments);
        this.options.controls = options && options.controls ? options.controls : false;
        this._superDeploy = VideoSurface.prototype.deploy;
    }

    VideoExtraSurfaceCell.prototype.deploy = function deploy(target) {
        this._superDeploy(target);
        target.controls = this.options.controls;

        this._videoElement = target;
    }

    VideoExtraSurfaceCell.prototype.play = function play() {
        return this._videoElement.play();
    }

    VideoExtraSurfaceCell.prototype.pause = function pause() {
        return this._videoElement.pause();
    }

    module.exports = VideoExtraSurfaceCell;
});
