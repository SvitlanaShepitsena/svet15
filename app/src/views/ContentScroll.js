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
            pageSwitchSpeed: 0.9,
            paginated: true,
            friction: 0.05,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 700,
            edgeDamp: 1,
            speedLimit: 1,
            margin: 5333
        })
    }

    ContentScroll.prototype = Object.create(ScrollContainer.prototype);
    ContentScroll.prototype.constructor = ContentScroll;

    ContentScroll.DEFAULT_OPTIONS = {};

    function _createContent() {
        this.contents = [];
        this.homePageView = new HomePageView();
        this.aboutUsView = new AboutUsView();

        this.homePageView.pipe(this.scrollview);
        this.aboutUsView.pipe(this.scrollview);

        this.contents.push(this.homePageView);
        this.contents.push(this.aboutUsView);


        this.scrollview.sequenceFrom(this.contents);

    };

    module.exports = ContentScroll;
});
