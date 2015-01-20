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

    function ScrollDesk() {
        ScrollContainer.apply(this, arguments);
        this.scrollContent = [];
        this.scrollview.sequenceFrom(this.scrollContent);

        _init.call(this);
        _fillContent.call(this);
        _pipe.call(this);
    }

    function _init() {

        this.scrollview.setOptions({
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
