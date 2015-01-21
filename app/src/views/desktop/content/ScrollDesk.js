define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    var HomeDesk = require('dviews/content/dpages/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');
    var ClientsDesk = require('dviews/content/dpages/ClientsDesk');
    var DemographicsDesk = require('dviews/content/dpages/DemographicsDesk');
    var RadioDesk = require('dviews/content/dpages/RadioDesk');
    var ContactUsDesk = require('dviews/content/dpages/ContactUsDesk');
    var Timer = require('famous/utilities/Timer');


    function ScrollDesk() {
        ScrollContainer.apply(this, arguments);
        this.scrollContent = [];
        this.scrollview.sequenceFrom(this.scrollContent);

        _init.call(this);
        _fillContent.call(this);
        _pipe.call(this);
        _scrollEvent.call(this);
    }

    function _scrollUtil() {
        console.log('tick');

    }

    function _scrollEvent() {
        var that = this;
        var startPosition, startPage, currentPosition, currentPage, moveDown, absPos;


        this.scrollview.sync.on('start', function () {
            startPosition = this.scrollview.getAbsolutePosition();
            startPage = this.scrollview.getCurrentIndex();

            this.scrollUtil = Timer.every(function () {
               absPos = this.scrollview.getAbsolutePosition() ;
                if (absPos < 0) {
                    this.scrollview.setPosition(0);
                }
            }.bind(this), 1);

            Timer.after(function () {
                currentPage = this.scrollview.getCurrentIndex();
                currentPosition = this.scrollview.getAbsolutePosition();
                moveDown = currentPosition > startPosition ? true : false;

                if (currentPage === 0 && startPosition <= 100 && moveDown) {

                    this._eventOutput.emit('decrease:header');
                }
                if (currentPage === 0 && currentPosition <= 100 && !moveDown) {

                    this._eventOutput.emit('increase:header');
                }
            }.bind(this), 1);

        }.bind(this));
        this.scrollview.sync.on('end', function () {
            Timer.clear(this.scrollUtil);
        }.bind(this))


    }

    function _init() {
        this.scrollview.setOptions({
            paginated: false
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
        for (var i = 0; i < this.scrollContent.length; i++) {
            var surface = this.scrollContent[i];
            surface.pipe(this.scrollview);
        }
    }

    ScrollDesk.prototype = Object.create(ScrollContainer.prototype);
    ScrollDesk.prototype.constructor = ScrollContainer;

    ScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = ScrollDesk;
});
