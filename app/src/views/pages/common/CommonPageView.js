/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');
    var Modifier = require("famous/core/Modifier");

    var CommonSlideView = require('views/pages/common/CommonSlideView');

    function CommonPageView() {
        View.apply(this, arguments);

        var centerModifier = new Modifier({
            size: [undefined, window.innerHeight * .93]
        });
        this.rootNode = this.add(centerModifier);

        _createSlides.call(this);
        _handleSwipe.call(this);
        _init.call(this);
    }

    CommonPageView.prototype = Object.create(View.prototype);
    CommonPageView.prototype.constructor = CommonPageView;

    CommonPageView.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        bg: null,
        width: window.innerWidth,
        height: window.innerHeight,
        lightboxOpts: {
            inTransform: Transform.translate(300, 0, 0),
            outTransform: Transform.translate(-500, 0, 0),
            inTransition: {duration: 500, curve: Easing.outBack},
            outTransition: {duration: 350, curve: Easing.inQuad}
        }
    };

    function _createSlides() {
        this.views = [];
        for (var i = 1; i < 4; i++) {
            this.commonSlideView = new CommonSlideView({
                bg: this.options.bgColor,
                content: this.options.page + '. View ' + i
            });
            /**
             * Pipe events from surface to view
             */
            this.commonSlideView.pipe(this._eventOutput);
            this.views.push(this.commonSlideView);
        }
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.rootNode.add(this.lightbox);
    }

    CommonPageView.prototype.nextView = function () {
        var currentView = this.views[this.currentIndex];
        var nextIndex = (this.currentIndex === this.views.length - 1) ? 0 : this.currentIndex + 1;
        var nextView = this.views[nextIndex];

        this.lightbox.setOptions({
            inTransform: this.options.lightboxOpts.inTransform,
            outTransform: this.options.lightboxOpts.outTransform
        })

        this.lightbox.hide(currentView, function () {
            this.lightbox.show(nextView);
        }.bind(this))

        this.currentIndex = nextIndex;
    }

    CommonPageView.prototype.prevView = function () {
        var currentView = this.views[this.currentIndex];
        var prevIndex = (this.currentIndex === 0) ? this.views.length - 1 : this.currentIndex - 1;
        var prevView = this.views[prevIndex];

        this.lightbox.setOptions({
            inTransform: this.options.lightboxOpts.outTransform,
            outTransform: this.options.lightboxOpts.inTransform
        })

        this.lightbox.hide(currentView, function () {
            this.lightbox.show(prevView);
        }.bind(this));

        this.currentIndex = prevIndex;
    }

    function _init() {
        this.currentIndex = 0;
        this.currentView = this.views[this.currentIndex];
        this.lightbox.show(this.currentView);
    }

    function _handleSwipe() {
        var that = this;
        var verticalShiftAbs, horisontalShiftAbs, isVertical;
        /**
         * Define wheter this scroll is horizontal
         * Then if it is horizontal, define wheter it is scroll back or force
         */
        this.options.sync.on("end", function (data) {
            verticalShiftAbs = Math.abs(data.delta[1]);
            horisontalShiftAbs = Math.abs(data.delta[0]);
            isVertical = verticalShiftAbs > horisontalShiftAbs;
            if (!isVertical) {
                if (data.delta[0] < 0) {
                    this.nextView.call(that);
                }
                else {
                    this.prevView.call(that);
                }
            }
        }.bind(this));
    }

    module.exports = CommonPageView;
});
