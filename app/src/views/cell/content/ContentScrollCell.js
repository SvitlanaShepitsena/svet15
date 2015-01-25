define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');

    var EventHandler = require('famous/core/EventHandler');
    var ScrollContainer = require('famous/views/ScrollContainer');

    var CommonPageCell = require('views/cell/content/common/CommonPageCell');
    var HomeCell = require('views/cell/content/home/HomeCell');

    var about1 = require('text!cviews/jade/about/about1.html');
    var about2 = require('text!cviews/jade/about/about2.html');
    var about3 = require('text!cviews/jade/about/about3.html');

    var radio1 = require('text!cviews/jade/radio/radio1.html');
    var radio2 = require('text!cviews/jade/radio/radio2.html');
    var radio3 = require('text!cviews/jade/radio/radio3.html');

    var contactus1 = require('text!cviews/jade/contactus/contactus1.html');
    var contactus2 = require('text!cviews/jade/contactus/contactus2.html');
    var contactus3 = require('text!cviews/jade/contactus/contactus3.html');


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
            groupScroll: false,
            syncScale: 0.5
        })
        _createContent.call(this);
    }

    ContentScrollCell.prototype = Object.create(ScrollContainer.prototype);
    ContentScrollCell.prototype.constructor = ContentScrollCell;

    ContentScrollCell.DEFAULT_OPTIONS = {};

    function _createContent() {
        this.contents = [];

        this.homeCell = new HomeCell();
        this.aboutUsCell = new CommonPageCell({
            bgColor: 'floralwhite',
            pages: ['about1', 'about2', 'about3'],
            sync: this.options.sync
        });
        this.radioCell = new CommonPageCell({
            bgColor: 'floralwhite',
            pages: ['radio1', 'radio2', 'radio3'],
            sync: this.options.sync
        });
        this.contactUsCell = new CommonPageCell({
            bgColor: 'floralwhite',
            pages: ['contactus1', 'contactus2', 'contactus3'],
            sync: this.options.sync
        });
        //this.demographicsCell = new CommonPageCell({bgColor: 'green', page: 'Demographics', sync: this.options.sync});
        //this.clientsCell = new CommonPageCell({bgColor: 'brown', page: 'clientsCell', sync: this.options.sync});
        /**
         * Connect each page view to GenericSync
         */
        this.homeCell.pipe(this.options.sync);
        this.aboutUsCell.pipe(this.options.sync);
        this.radioCell.pipe(this.options.sync);
        this.contactUsCell.pipe(this.options.sync);
        //this.demographicsCell.pipe(this.options.sync);
        //this.clientsCell.pipe(this.options.sync);

        this.contents.push(this.homeCell);
        this.contents.push(this.aboutUsCell);
        this.contents.push(this.radioCell);
        this.contents.push(this.contactUsCell);
        //this.contents.push(this.demographicsCell);
        //this.contents.push(this.clientsCell);
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
