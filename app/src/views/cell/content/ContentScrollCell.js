define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var ScrollContainer = require('famous/views/ScrollContainer');

    /*Require App*/
    var CommonPageCell = require('cviews/content/common/CommonPageCell');
    var HomeCell = require('cviews/content/home/HomeCell');
    var RadioPageCell = require('cviews/content/radio/RadioPageCell');
    var RadioScrollCell = require('cviews/content/radio/RadioScrollCell');

    /*Html*/
    var about1 = require('text!cviews/jade/about/about1.html');
    var about2 = require('text!cviews/jade/about/about2.html');
    var about3 = require('text!cviews/jade/about/about3.html');

    var contactus1 = require('text!cviews/jade/contactus/contactus1.html');

    ContentScrollCell.prototype = Object.create(ScrollContainer.prototype);
    ContentScrollCell.prototype.constructor = ContentScrollCell;

    ContentScrollCell.DEFAULT_OPTIONS = {};

    function ContentScrollCell() {
        ScrollContainer.apply(this, arguments);
        /**
         * Assign an event handler to receive an object's input events.
         */
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);

        this.scrollview.setOptions({
            direction: 1,
            rails: true,
            friction: 0.0005,
            drag: 0.0005,
            edgeGrip: 0.3,
            edgePeriod: 300,
            edgeDamp: 1,
            margin: 5900, // mostly safe
            paginated: true,
            pagePeriod: 500,
            pageDamp: 0.8,
            pageStopSpeed: 10,
            pageSwitchSpeed: 0.5,
            speedLimit: 1,
            syncScale: 0.5
        })
        _createContent.call(this);
    }


    function _createContent() {
        this.contents = [];

        this.homeCell = new HomeCell();
        this.aboutUsCell = new CommonPageCell({
            bgColor: 'floralwhite',
            folder: 'about',
            pages: ['about1', 'about2', 'about3'],
            sync: this.options.sync
        });

        this.radioCell = new RadioPageCell({
            sync: this.options.sync
        });


        this.contactUsCell = new CommonPageCell({
            bgColor: 'floralwhite',
            folder: 'contactus',
            pages: ['contactus1'],
            sync: this.options.sync
        });
        /**
         * Connect each page view to GenericSync
         */
        this.homeCell.pipe(this.options.sync);
        this.aboutUsCell.pipe(this.options.sync);
        this.radioCell.pipe(this.options.sync);
        this.contactUsCell.pipe(this.options.sync);

        this.contents.push(this.homeCell);
        this.contents.push(this.aboutUsCell);
        this.contents.push(this.radioCell);
        this.contents.push(this.contactUsCell);


        this.scrollview.sequenceFrom(this.contents);

    };

    ContentScrollCell.prototype.nextPage = function () {
        this.scrollview.goToNextPage();
    }
    ContentScrollCell.prototype.prevPage = function () {
        this.scrollview.goToPreviousPage();
    }

    module.exports = ContentScrollCell;
});
