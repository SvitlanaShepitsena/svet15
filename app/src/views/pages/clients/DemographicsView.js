/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');
    var Modifier = require("famous/core/Modifier");

    var SlideView = require('views/pages/demographics/SlideView');

    function DemographicsView() {
        View.apply(this, arguments);

        var bgModifier = new Modifier({
            size: [undefined, undefined]
        });

        this.bg = new Surface({
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.rootNode = this.add(bgModifier);
        this.rootNode.add(this.bg);

        _createSlides.call(this);

        _init.call(this);
    }

    function _init() {
        this.currentIndex = 0;
        var currentView = this.views[this.currentIndex];
        this.lightbox.show(currentView);

    }

    function _createSlides() {
        var that = this;
        this.views = [];
        var colors = ['red', 'yellow', 'green'];

        for (var i = 0; i < 3; i++) {
            var view = new SlideView(colors[i]);
            view.on('click', function () {
                that.nextView.call(that);
            })
            this.views.push(view);
        }

        this.lightbox = new Lightbox(this.options.lightboxOpts);

        this.rootNode.add(this.lightbox);
    }


    DemographicsView.prototype = Object.create(View.prototype);
    DemographicsView.prototype.constructor = DemographicsView;

    DemographicsView.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        lightboxOpts: {
            inTransform: Transform.translate(300, 0, 0),
            outTransform: Transform.translate(-500, 0, 0),
            inTransition: {duration: 500, curve: Easing.outBack},
            outTransition: {duration: 350, curve: Easing.inQuad}
        }
    };

    DemographicsView.prototype.nextView = function () {
        var currentView = this.views[this.currentIndex];
        var nextIndex = (this.currentIndex === this.views.length-1)?0:this.currentIndex+1;
        var nextView = this.views[nextIndex];

        this.lightbox.hide(currentView);
        this.lightbox.show(nextView);

        this.currentIndex = nextIndex;
    }

    module.exports = DemographicsView;
});
