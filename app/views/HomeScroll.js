define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollView = require('famous/views/Scrollview');

    var EventHandler = require('famous/core/EventHandler');

    function HomeScroll(sync) {
        this.generalSync = sync;

        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);

        this.eventInput.on('pageChange', function (index) {
            alert(index);
        })

        ScrollView.apply(this, arguments);

        _createContent.call(this);

    }

    HomeScroll.prototype = Object.create(ScrollView.prototype);
    HomeScroll.prototype.constructor = HomeScroll;


    HomeScroll.DEFAULT_OPTIONS = {};

    function _createContent() {
        var that = this;
        var genericSync = this.generalSync;


        var homePage = require('text!jade/homePage.html');
        var aboutUsPage = require('text!jade/aboutUsPage.html');
        var demographicsPage = require('text!jade/demographicsPage.html');
        var clientsPage = require('text!jade/clientsPage.html');
        var radioPage = require('text!jade/radioPage.html');
        var contactUsPage = require('text!jade/contactUsPage.html');

        this.contents = [];
        this.setOptions({
            pagePeriod: 700
        });

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: homePage,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFE1D0'
            }
        });
        this.contentAbout = new Surface({
            size: [undefined, undefined],
            content: aboutUsPage,
            properties: {
                backgroundColor: '#E6FFEF'
            }
        });
        this.contentDemographics = new Surface({
            size: [undefined, undefined],
            content: demographicsPage,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
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

        this.contentHome.pipe(genericSync);
        this.contentAbout.pipe(genericSync);
        this.contentDemographics.pipe(genericSync);
        this.contentClients.pipe(genericSync);
        this.contentRadio.pipe(genericSync);
        this.contentContact.pipe(genericSync);

        genericSync.on("start", function () {
        });

        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                that.goToNextPage();
            } else {

                that.goToPreviousPage();
            }
        });

        genericSync.on("end", function () {

        });

        this.contents.push(this.contentHome);
        this.contents.push(this.contentAbout);
        this.contents.push(this.contentDemographics);
        this.contents.push(this.contentClients);
        this.contents.push(this.contentRadio);
        this.contents.push(this.contentContact);
        this.sequenceFrom(this.contents);

    };

    module.exports = HomeScroll;
});
