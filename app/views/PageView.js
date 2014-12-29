define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var HomeScroll = require('views/HomeScroll');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HeaderView = require('views/HeaderView');
    var homePage = require('text!jade/homePage.html');
    var aboutUsPage = require('text!jade/aboutUsPage.html');
    var demographicsPage = require('text!jade/demographicsPage.html');
    var clientsPage = require('text!jade/clientsPage.html');
    var radioPage = require('text!jade/radioPage.html');

    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var ScrollSync = require("famous/inputs/ScrollSync");

    function PageView() {
        var that = this;
        GenericSync.register({
            mouse: MouseSync,
            touch: TouchSync,
            scroll: ScrollSync
        });

        var genericSync = new GenericSync(['mouse', 'touch', 'scroll']);

        View.apply(this, arguments);

        this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        });

        /*Header*/
        this.header = new HeaderView();
        this.header.pipe(this);

        /*Content*/
        this.content = new HomeScroll(genericSync);
        var currentIndex = 0;

        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                currentIndex++;
            } else {

                currentIndex--;
            }

            if (currentIndex > 5) {
                currentIndex = 5;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }
            console.log(currentIndex);
            that.footerLeft.setAttributes({backgroundColor: 'black'})
        });

        /* =Footer*/
        this.footers = [];
        this.footer = new GridLayout({
            dimensions: [3, 1]
        });
        this.footer.pipe(this);

        this.footerLeft = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: this.getColor(currentIndex),
                backgroundSize: 'cover'
            }
        })

        this.footerCenter = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#D95829',
                backgroundSize: 'cover'
            }
        })

        this.footerRight = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#F27649',
                backgroundSize: 'cover'
            }
        })
        this.footers.push(this.footerLeft);
        this.footers.push(this.footerCenter);
        this.footers.push(this.footerRight);
        this.footer.sequenceFrom(this.footers);

        this.layout.content.add(this.content);
        this.layout.header.add(this.header);
        this.layout.footer.add(this.footer);

        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    /*******************/

    /*****************/
    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.prototype.getColor = function (currentPage) {
        var colors = ['red', 'green', 'yellow', 'brown', 'orange', 'black'];
        return colors[currentPage];
    }

    module.exports = PageView;

})
;
