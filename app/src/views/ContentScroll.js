define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ViewSequence = require('famous/core/ViewSequence');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');

    var HomePageView = require('views/pages/home/HomeView');
    var AboutUsView = require('views/pages/aboutUs/AboutUsView');

    function ContentScroll(sync) {
        this.generalSync = sync;
        this.eventInput = new EventHandler();
        /*Assign an event handler to receive an object's input events.*/
        EventHandler.setInputHandler(this, this.eventInput);

        ScrollContainer.apply(this, arguments);
        _createContent.call(this);

        this.scrollview.setOptions({
            direction: 1,
            rails: true,
            friction: 0.0005,
            drag: 0.0005,
            edgeGrip: 0.3,
            edgePeriod: 300,
            edgeDamp: 1,
            margin: 16000,       // mostly safe
            paginated: true,
            pagePeriod: 500,
            pageDamp: 0.8,
            pageStopSpeed: 10,
            pageSwitchSpeed: 0.5,
            speedLimit: 1,
            groupScroll: false,
            syncScale: 0.5
        })
    }

    ContentScroll.prototype = Object.create(ScrollContainer.prototype);
    ContentScroll.prototype.constructor = ContentScroll;

    ContentScroll.DEFAULT_OPTIONS = {};

    function _createContent() {
        var that = this;
        this.contents = [];
        this.homePageView = new HomePageView();
        this.aboutUsView = new AboutUsView();

        this.homePageView.pipe(this.options.sync);
        this.aboutUsView.pipe(this.options.sync);

        this.contents.push(this.homePageView);
        this.contents.push(this.aboutUsView);

        this.scrollview.sequenceFrom(this.contents);

        this.scrollview.pipe(this.generalSync);
        var maxLength = this.contents.length * 750;

        this.scrollview.sync.on('update', function (data) {
            var currentIndex =that.scrollview.getPosition();


            var absolutePos = this.scrollview.getAbsolutePosition();
            if (absolutePos < -100) {
                this.scrollview.setPosition(-100);
            }
            if (absolutePos > 650) {
                this.scrollview.setPosition(650);
            }

        }.bind(this))
    };

    module.exports = ContentScroll;
});
