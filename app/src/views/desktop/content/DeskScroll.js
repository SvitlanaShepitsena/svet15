define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    var HomeDesk = require('dviews/content/dpages/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');


    function DeskScroll() {
        ScrollContainer.apply(this, arguments);
        this.scrollContent = [];
        _fillContent.call(this);

        this.scrollview.sequenceFrom(this.scrollContent);

        _pipe.call(this);
    }

    function _pipe() {
        for (var i = 0; i < this.scrollContent.length; i++) {
            var surface = this.scrollContent[i];
            surface.pipe(this.scrollview);
        }

    }


    function _fillContent() {
        this.homeDesk = new HomeDesk();
        this.aboutUsDesk = new AboutUsDesk();


        this.scrollContent.push(this.homeDesk);
        this.scrollContent.push(this.aboutUsDesk);
    }


    DeskScroll.prototype = Object.create(ScrollContainer.prototype);
    DeskScroll.prototype.constructor = ScrollContainer;

    DeskScroll.DEFAULT_OPTIONS = {};

    module.exports = DeskScroll;
});
