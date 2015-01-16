define(function (require, exports, module) {

    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var View = require('famous/core/View');
    var Transform = require('famous/core/Transform');

    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var Transitionable = require('famous/transitions/Transitionable');
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var ScrollSync = require("famous/inputs/ScrollSync");

    var HeaderCell = require('views/cell/header/HeaderCell');
    var ContentScroll = require('views/cell/content/ContentScrollCell');
    var FooterCell = require('views/cell/footer/FooterCell');


    function PageViewCell() {
        View.apply(this, arguments);
        this.layout = new HeaderFooterLayout({
            headerSize: this.options.headerSize,
            footerSize: this.options.footerSize
        });

        /*=Header*/
        this.header = new HeaderCell();
        this.header.pipe(this);

        /**
         * Register a global sync classes with an identifying key
         */
        GenericSync.register({
            mouse: MouseSync,
            touch: TouchSync,
            scroll: ScrollSync
        });
        var genericSync = new GenericSync(['mouse', 'touch', 'scroll']);

        /*=Content*/
        /**
         * Cteate content With GenericSync param sync
         */
        this.content = new ContentScroll({sync: genericSync});
        this.content.pipe(this);

        /**
         * Define wheter this scroll vertical
         * Then if it is vertical, define wheter it is scroll up or down
         */
        var isVertical, verticalShiftAbs, horisontalShiftAbs;

        genericSync.on("end", function (data) {
            verticalShiftAbs = Math.abs(data.delta[1]);
            horisontalShiftAbs = Math.abs(data.delta[0]);
            isVertical = verticalShiftAbs > horisontalShiftAbs;
            if (isVertical) {
                if (data.delta[1] < 0) {
                    this.content.nextPage();
                }
                else {
                    this.content.prevPage();
                }
            }
        }.bind(this));

        /* =Footer*/
        this.layout.footer = new FooterCell({
                backgroundColor: "black"
            }
        );

        this.layout.content.add(this.content);
        this.layout.header.add(this.header);
        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    PageViewCell.DEFAULT_OPTIONS = {
        headerSize: 0.08 * window.innerHeight,
        footerSize: 0.07 * window.innerHeight
    };

    PageViewCell.prototype = Object.create(View.prototype);
    PageViewCell.prototype.constructor = PageViewCell;

    PageViewCell.prototype.navigateTo = function (index) {
        this.content.scrollview.goToPage(index);
    }

    module.exports = PageViewCell;

})
;
