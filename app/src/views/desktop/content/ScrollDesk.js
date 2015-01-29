define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    var HomeDesk = require('dviews/content/home/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');
    var RadioDesk = require('dviews/content/dpages/RadioDesk');
    var ContactUsDesk = require('dviews/content/dpages/ContactUsDesk');
    var Timer = require('famous/utilities/Timer');


    function ScrollDesk() {
        this.headerFull = true;
        ScrollContainer.apply(this, arguments);
        this.scrollContent = [];
        this.scrollview.sequenceFrom(this.scrollContent);

        _init.call(this);
        _fillContent.call(this);
        _pipe.call(this);
        _scrollEvent.call(this);
    }

    ScrollDesk.prototype = Object.create(ScrollContainer.prototype);
    ScrollDesk.prototype.constructor = ScrollContainer;
    ScrollDesk.DEFAULT_OPTIONS = {};

    function _init() {
        this.scrollview.setOptions({
            rails: true,
            margin: 1000,       // mostly safe
            friction: 0.0007,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 300,
            edgeDamp: 1,
            paginated: false,
            pagePeriod: 500,
            pageDamp: 0.8,
            pageStopSpeed: 9,
            pageSwitchSpeed: 0.5,
            speedLimit: 5,
            groupScroll: false,
            syncScale: 2
        })
    }

    function _scrollEvent() {
        var that = this;
        var startPosition, startPage, currentPosition, currentPage, moveDown, absPos, coef;
        var emitDecrease = false, emitIncrease = false;

        this.scrollview.sync.on('start', function () {
            startPosition = this.scrollview.getAbsolutePosition();
            startPage = this.scrollview.getCurrentIndex();
            emitDecrease = false;
            emitIncrease = false;
            this.scrollUtil = Timer.every(function () {
                currentPage = this.scrollview.getCurrentIndex();
                currentPosition = this.scrollview.getAbsolutePosition();
                moveDown = currentPosition > startPosition ? true : false;

                if (currentPage === 0 && startPosition <= window.sv.sizing.headerHeight && moveDown && !emitDecrease) {
                    this.headerFull = false;
                    this._eventOutput.emit('decrease:header');
                    this.homeDesk.hideShowMap(0);
                    emitDecrease = true;
                }
                if (currentPage === 0 && currentPosition <= window.sv.sizing.headerHeight && !moveDown && !emitIncrease) {

                    this.headerFull = true;
                    this._eventOutput.emit('increase:header');
                    this.homeDesk.hideShowMap(1);

                    this.aboutUsDesk.long();
                    this.homeDesk.tuneToDefaultView();
                    emitIncrease = true;
                }
                absPos = this.scrollview.getAbsolutePosition();
                if (absPos < 0) {
                    this.scrollview.setPosition(0);
                }

            }.bind(this), 1);
        }.bind(this));

        this.scrollview.sync.on('end', function () {
            var absPos = this.scrollview.getAbsolutePosition();
            Timer.clear(this.scrollUtil);
            if (this.headerFull && absPos < 140) {
                this.scrollview.setPositionAnimated(-0.05);

            }
        }.bind(this))

    }


    function _fillContent() {
        this.homeDesk = new HomeDesk();
        this.aboutUsDesk = new AboutUsDesk();
        this.radioDesk = new RadioDesk();
        this.contactUsDesk = new ContactUsDesk();


        this.scrollContent.push(this.homeDesk);
        this.scrollContent.push(this.aboutUsDesk);
        this.scrollContent.push(this.radioDesk);
        this.scrollContent.push(this.contactUsDesk);
    }

    function _pipe() {

        for (var i = 0; i < this.scrollContent.length; i++) {
            var surface = this.scrollContent[i];
            surface.pipe(this.scrollview);
        }
    }


    ScrollDesk.prototype.tuneToShortHeader = function () {
        var currentPos = this.scrollview.getAbsolutePosition();
        if (currentPos < 150) {
            this.scrollview.setPositionAnimated.call(this.scrollview, 0.05);
        }
        this.homeDesk.tuneToShortView();
        this.aboutUsDesk.short();

    }
    ScrollDesk.prototype.tuneToDefaultHeader = function () {
        //var currentPos = this.scrollview.getAbsolutePosition();
        //if (currentPos < 150) {
        //    this.scrollview.setPositionAnimated.call(this.scrollview, 150);
        //}
        this.homeDesk.tuneToDefaultView();


    }


    module.exports = ScrollDesk;
});
