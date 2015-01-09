define(function (require, exports, module) {

    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ContentScroll = require('views/ContentScroll');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HeaderView = require('views/HeaderView');

    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var ScrollSync = require("famous/inputs/ScrollSync");

    var Transitionable = require('famous/transitions/Transitionable');


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
        this.content = new ContentScroll({sync: genericSync});
        this.content.pipe(this);

        var isVertical;
        var currentIndex = 0;
        var part = 1 / 6;
        var prevElement, prevElementTemp,
            verticalShiftAbs, horisontalShiftAbs,
            currentElement, currentElementTemp, direction;


        genericSync.on("update", function (data) {
            verticalShiftAbs = Math.abs(data.delta[1]);
            horisontalShiftAbs = Math.abs(data.delta[0]);
            isVertical = verticalShiftAbs > horisontalShiftAbs;

            if (isVertical) {
                this.content.nextPage();
            }
        }.bind(this));

        /* =Footer*/
        this.footers = [];
        this.footer = new GridLayout({
            dimensions: [3, 1]
        });
        this.footer.pipe(this);

        this.footerLeft = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundSize: 'cover'
            }
        })

        this.footerCenter = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundSize: 'cover'
            }
        })

        this.footerRight = new Surface({
            size: [undefined, undefined],
            properties: {
                //backgroundColor: '#F27649',
                backgroundSize: 'cover'
            }
        })
        this.footers.push(this.footerLeft);

        this.footers.push(this.footerCenter);
        this.footers.push(this.footerRight);
        this.footer.sequenceFrom(this.footers);

        this.layout.content.add(this.content);
        this.layout.header.add(this.header);

        this.state1 = new Transitionable(1);
        this.modifier1 = new Modifier({
            opacity: function () {
                return that.state1.get();
            }
        });
        this.surface1 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#E5CABB'
            }
        });

        this.state2 = new Transitionable(0);
        this.modifier2 = new Modifier({
            opacity: function () {
                return that.state2.get();
            }
        });
        this.surface2 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#CFE5D7'
            }
        });

        this.state3 = new Transitionable(0);
        this.modifier3 = new Modifier({
            opacity: function () {
                return that.state3.get();
            }
        });
        this.surface3 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#E5E1CB'
            }
        });

        this.state4 = new Transitionable(0);
        this.modifier4 = new Modifier({
            opacity: function () {
                return that.state4.get();
            }
        });
        this.surface4 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#CFE5C5'
            }
        });

        this.state5 = new Transitionable(0);
        this.modifier5 = new Modifier({
            opacity: function () {
                return that.state5.get();
            }
        });
        this.surface5 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#E5D9D2'
            }
        });

        this.state6 = new Transitionable(0);
        this.modifier6 = new Modifier({
            opacity: function () {
                return that.state6.get();
            }
        });
        this.surface6 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#E5CABB'
            }
        });
        this.states = [];
        this.states.push(this.state1);
        this.states.push(this.state2);
        this.states.push(this.state3);
        this.states.push(this.state4);
        this.states.push(this.state5);
        this.states.push(this.state6);

        this.layout.footer.add(this.modifier1).add(this.surface1).add(this.footer);
        this.layout.footer.add(this.modifier2).add(this.surface2).add(this.footer);
        this.layout.footer.add(this.modifier3).add(this.surface3).add(this.footer);
        this.layout.footer.add(this.modifier4).add(this.surface4).add(this.footer);
        this.layout.footer.add(this.modifier5).add(this.surface5).add(this.footer);
        this.layout.footer.add(this.modifier6).add(this.surface6).add(this.footer);

        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.prototype.navigateTo = function (index) {
        for (var i = 0; i < this.states.length; i++) {
            var state = this.states[i];
            state.set(0);
        }
        var navigatedState = this.states[index];
        navigatedState.set(1, {duration: 300});
        this.content.scrollview.goToPage(index);
    }

    module.exports = PageView;

})
;
