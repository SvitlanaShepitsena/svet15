define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollView = require('famous/views/Scrollview');

    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var ScrollSync = require("famous/inputs/ScrollSync");

    function HomeScroll() {
        ScrollView.apply(this, arguments);

        _createContent.call(this);
    }

    HomeScroll.prototype = Object.create(ScrollView.prototype);
    HomeScroll.prototype.constructor = HomeScroll;

    HomeScroll.DEFAULT_OPTIONS = {
        options: {
            pageSwitchSpeed: 0.6
        }
    };

    function _createContent() {
        var that = this;

        GenericSync.register({
            mouse: MouseSync,
            touch: TouchSync,
            scroll: ScrollSync
        });

        var genericSync = new GenericSync(['mouse', 'touch', 'scroll']);

        var homePage = require('text!jade/homePage.html');
        this.contents = [];
        this.setOptions({
            pagePeriod:700
        });

        console.log(this.options.pageSwitchSpeed);
        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: homePage,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFFAE2'
                //backgroundColor: '#FFE1D0'
            }
        });
        this.contentAbout = new Surface({
            size: [undefined, undefined],
            content: 'About',
            properties: {
                fontSize: '16px',
                backgroundColor: 'green'
                //backgroundColor: '#FFE1D0'
            }
        });

        var velocity = 0;
        var delta = 0;

        this.contentHome.pipe(genericSync);
        this.contentAbout.pipe(genericSync);

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
        this.sequenceFrom(this.contents);


    };

    module.exports = HomeScroll;
});
