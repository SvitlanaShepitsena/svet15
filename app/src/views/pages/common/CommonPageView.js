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
            view.on('click', function () {
                that.nextView.call(that);
            })
            this.views.push(view);
        }

        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.rootNode.add(this.lightbox);
    }


    CommonPageView.prototype.nextView = function () {
        var currentView = this.views[this.currentIndex];
        var nextIndex = (this.currentIndex === this.views.length - 1) ? 0 : this.currentIndex + 1;
        var nextView = this.views[nextIndex];

        this.lightbox.hide(currentView, function () {

            this.lightbox.show(nextView);
        }.bind(this))

        this.currentIndex = nextIndex;
    }

    module.exports = CommonPageView;
});
