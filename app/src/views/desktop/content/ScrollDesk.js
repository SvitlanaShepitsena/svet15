define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    var HomeDesk = require('dviews/content/home/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');
    var ClientsDesk = require('dviews/content/dpages/ClientsDesk');
    var DemographicsDesk = require('dviews/content/dpages/DemographicsDesk');
    var RadioDesk = require('dviews/content/dpages/RadioDesk');
    var ContactUsDesk = require('dviews/content/dpages/ContactUsDesk');
    var Timer = require('famous/utilities/Timer');
    var ScrollSync = require("famous/inputs/ScrollSync");


    function ScrollDesk() {
        ScrollContainer.apply(this, arguments);
        this.scrollContent = [];
        this.scrollview.sequenceFrom(this.scrollContent);

        _init.call(this);
        _fillContent.call(this);
        _pipe.call(this);
        _scrollEvent.call(this);
    }

    function _scrollEvent() {
        var that = this;
        var startPosition, startPage, currentPosition, currentPage, moveDown, absPos;

        this.scrollview.sync.on('start', function () {
            startPosition = this.scrollview.getAbsolutePosition();
            startPage = this.scrollview.getCurrentIndex();

            this.scrollUtil = Timer.every(function () {
                currentPage = this.scrollview.getCurrentIndex();
                currentPosition = this.scrollview.getAbsolutePosition();
                moveDown = currentPosition > startPosition ? true : false;

                if (currentPage === 0 && startPosition <= 100 && moveDown) {

                    this._eventOutput.emit('decrease:header');
                }
                if (currentPage === 0 && currentPosition <= 100 && !moveDown) {

                    this._eventOutput.emit('increase:header');
                }
                absPos = this.scrollview.getAbsolutePosition();
                if (absPos < 0) {
                    this.scrollview.setPosition(0);
                }
            }.bind(this), 1);
        }.bind(this));

        this.scrollview.sync.on('end', function () {
            Timer.clear(this.scrollUtil);
        }.bind(this))
        this.scrollview.sync.on('update', function () {
        }.bind(this))
    }

    function _init() {
        this.scrollview.setOptions({
            rails: true,
            friction: 0.0007,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 300,
            edgeDamp: 1,
            margin: 1000,       // mostly safe
            paginated: false,
            pagePeriod: 500,
            pageDamp: 0.8,
            pageStopSpeed: 5,
            pageSwitchSpeed: 0.5,
            speedLimit: 5,
            groupScroll: false,
            syncScale: 0.07
        })
    }

    function _fillContent() {
        this.homeDesk = new HomeDesk();
        this.aboutUsDesk = new AboutUsDesk();
        this.clientsDesk = new ClientsDesk();
        this.demographicsDesk = new DemographicsDesk();
        this.radioDesk = new RadioDesk();
        this.contactUsDesk = new ContactUsDesk();


        this.scrollContent.push(this.homeDesk);
        this.scrollContent.push(this.aboutUsDesk);
        this.scrollContent.push(this.clientsDesk);
        this.scrollContent.push(this.demographicsDesk);
        this.scrollContent.push(this.radioDesk);
        this.scrollContent.push(this.contactUsDesk);
    }

    function _pipe() {
        this.scrollSync = new ScrollSync();
        var counter = 0;
        var counterView = 0;
        var currVelocity, prevVelocity;

        this.scrollSync.on('start', function (data) {
            //var velocity =  this.scrollSync._payload.delta[1];
            // console.log(velocity);
            // if (data.delta !== null) {
            //     data.delta[1]>0?this.scrollview.goToNextPage():this.scrollview.goToPreviousPage();
            // }
            //this.scrollview.goToNextPage();
        }.bind(this));

        for (var i = 0; i < this.scrollContent.length; i++) {
            var surface = this.scrollContent[i];
            surface.pipe(this.scrollview);
        }
    }

    ScrollDesk.prototype = Object.create(ScrollContainer.prototype);
    ScrollDesk.prototype.constructor = ScrollContainer;

    ScrollDesk.prototype.tuneToShortHeader = function () {
        var currentPos = this.scrollview.getAbsolutePosition();


    }

    ScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = ScrollDesk;
});
