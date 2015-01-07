define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ViewSequence = require('famous/core/ViewSequence');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');

    var HomePageView = require('views/pages/HomePageView');
    var AboutUsView = require('views/pages/AboutUsView');

    var DemographicView = require('views/pages/demographics/DemographicsView');


    function HomeScroll(sync) {
        this.generalSync = sync;
        this.eventInput = new EventHandler();
        /*Assign an event handler to receive an object's input events.*/
        EventHandler.setInputHandler(this, this.eventInput);

        this.eventInput.on('pageChange', function (index) {
            alert(index);
        })

        ScrollContainer.apply(this, arguments);
        _createContent.call(this);

        this.scrollview.setOptions({
            pageSwitchSpeed: 0.2,
            paginated: true,
            friction: 0.005,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 300,
            edgeDamp: 1,
            speedLimit: 1,
            margin: 5330
        })
    }

    HomeScroll.prototype = Object.create(ScrollContainer.prototype);
    HomeScroll.prototype.constructor = HomeScroll;

    HomeScroll.DEFAULT_OPTIONS = {};

    function _createContent() {
        var that = this;
        var genericSync = this.generalSync;

        this.aboutUsView = new AboutUsView(genericSync);
        //this.homePageView = new HomePageView(genericSync);
        this.demographicsPage = new DemographicView(genericSync);

        var clientsPage = require('text!jade/clientsPage.html');
        var hash = require('text!jade/about1.html');
        var has2 = require('text!jade/about2.html');
        var radioPage = require('text!jade/radioPage.html');
        var contactUsPage = require('text!jade/contactUsPage.html');


        this.contents = [];



        this.contentClients = new Surface({
            size: [undefined, undefined],
            content: clientsPage,
            properties: {
                backgroundColor: '#E6FFDB'
            }
        });
        this.contentRadio = new Surface({
            size: [undefined, undefined],
            content: radioPage,
            properties: {
                backgroundColor: '#FFF1E9'
            }
        });
        this.contentContact = new Surface({
            size: [undefined, undefined],
            content: contactUsPage,
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.demographicsPage.pipe(genericSync);
        this.contentClients.pipe(genericSync);
        this.contentRadio.pipe(genericSync);
        this.contentContact.pipe(genericSync);

        genericSync.on("start", function () {
        });

        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                that.scrollview.goToNextPage();
            } else {

                that.scrollview.goToPreviousPage();
            }
        });

        genericSync.on("end", function () {

        });

        //this.contents.push(this.homePageView);
        this.contents.push(this.aboutUsView);
        this.contents.push(this.demographicsPage);
        //this.contents.push(this.contentClients);
        //this.contents.push(this.contentRadio);
        //this.contents.push(this.contentContact);
        this.sequenceFrom(this.contents);

    };

    module.exports = HomeScroll;
});
