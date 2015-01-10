define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ViewSequence = require('famous/core/ViewSequence');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');

    var CommonPageView = require('views/pages/common/CommonPageView');

    function ContentScroll() {
        this.eventInput = new EventHandler();
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
            margin: 5900,       // mostly safe
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

        this.homePageView = new CommonPageView({bgColor:'yellow', page:'Home',sync:this.options.sync});
        this.aboutUsView = new CommonPageView({bgColor:'orange', page:'About Us',sync:this.options.sync});
        this.demographicsView = new CommonPageView({bgColor:'green', page:'Demographics',sync:this.options.sync});
        this.clients = new CommonPageView({bgColor:'brown', page:'clients',sync:this.options.sync});

        this.homePageView.pipe(this.options.sync);
        this.aboutUsView.pipe(this.options.sync);
        this.demographicsView.pipe(this.options.sync);
        this.clients.pipe(this.options.sync);

        this.contents.push(this.homePageView);
        this.contents.push(this.aboutUsView);
        this.contents.push(this.demographicsView);
        this.contents.push(this.clients);

        this.scrollview.sequenceFrom(this.contents);


        var maxSize = (this.contents.length-1)*(window.innerHeight-100);

        this.scrollview.sync.on('update', function (data) {

            var absolutePos = this.scrollview.getAbsolutePosition();
            if (absolutePos < -50) {
                this.scrollview.setPosition(-50);
            }

            if (absolutePos > maxSize) {
                this.scrollview.setPosition(50);
            }

        }.bind(this))
    };

    ContentScroll.prototype.nextPage = function () {
        this.scrollview.goToNextPage();
    }
    ContentScroll.prototype.prevPage = function () {
        this.scrollview.goToPreviousPage();
    }

    module.exports = ContentScroll;
});
