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
            size: [undefined, window.innerHeight - 100],
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });
        var underGround = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: "grey"
            }
        });

        this.rootNode = this.add(centerModifier);
        this.rootNode.add(underGround);

        _createSlides.call(this);
        _init.call(this);

        _handleSwipe.call(this);
    }

    function _handleSwipe() {
        var that = this;
        var verticalShiftAbs, horisontalShiftAbs, isVertical;
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

    CommonPageView.prototype = Object.create(View.prototype);
    CommonPageView.prototype.constructor = CommonPageView;

    CommonPageView.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        lightboxOpts: {
            inTransform: Transform.translate(300, 0, 0),
            outTransform: Transform.translate(-500, 0, 0),
            inTransition: {duration: 500, curve: Easing.outBack},
            outTransition: {duration: 350, curve: Easing.inQuad}
        }
    };

    function _init() {
        this.currentIndex = 0;
        this.currentView = this.views[this.currentIndex];
        this.lightbox.show(this.currentView);
    }

    function _createSlides() {
        var that = this;
        this.views = [];
        var colors = ['green', 'yellow', 'blue'];

        for (var i = 1; i < 4; i++) {
            var view = new CommonSlideView({
                bg: this.options.bgColor,
                content: this.options.page + '. View ' + i
            });
            view.pipe(this._eventOutput);
            this.views.push(view);
        }

        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.rootNode.add(this.lightbox);
    }


    CommonPageView.prototype.nextView = function () {
        var currentView = this.views[this.currentIndex];
        var nextIndex = (this.currentIndex === this.views.length - 1) ? 0 : this.currentIndex + 1;
        var nextView = this.views[nextIndex];

        this.lightbox.setOptions({
            inTransform: Transform.translate(300, 0, 0),
            outTransform: Transform.translate(-500, 0, 0)
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
            outTransform: Transform.translate(300, 0, 0),
            inTransform: Transform.translate(-500, 0, 0)
        })

        this.lightbox.hide(currentView, function () {
            this.lightbox.show(prevView);
        }.bind(this));

        this.currentIndex = prevIndex;
    }

    module.exports = CommonPageView;
});
