/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable = require('famous/transitions/Transitionable');

    function HomeCell() {
        View.apply(this, arguments);
        _init.call(this);
        _flex.call(this);
    }

    HomeCell.DEFAULT_OPTIONS = {
        height: window.innerHeight,
        width: window.innerWidth,
        slidePosition: window.innerWidth / 2,
        contProp: {
            backgroundColor: '#FFF2DF'
        },
        sectionProp: {
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '5px',
            textAlign: "center"
        }
    };

    function _flex() {
        this.flexMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });
        this.layout = new FlexibleLayout({
            ratios: [2, 2, 2],
            direction: 1
        });
        this.flexContent = [];

        this.fSurface1 = new Surface({
            content: "<img class='img-logo-mob' src='../../../../img/home-page/svet-logo-mob.png'>" +
            " <h3> REACHING UNTAPPED MARKETS</h3>",
            properties: this.options.sectionProp
        });

        this.fSurface2 = new Surface({
            size: [undefined, undefined],
            content: '<div class="section-frame">' +
            "<h4>SVET Daily <br/> Newspaper</h4>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/news-daily-or.png'></div" +
            '</div>' +
            '</div>',
            properties: this.options.sectionProp
        });

        this.renderNode2 = new RenderNode();

        this.stateMod2 = new StateModifier({
            transform: Transform.translate(-this.options.slidePosition, 0, 0)
        });

        this.stateMod2.setTransform(Transform.translate(0, 0, 0),
            {duration: 300, curve: 'linear'}
        );
        this.renderNode2.add(this.stateMod2).add(this.fSurface2);

        this.fSurface3 = new Surface({
            size: [undefined, undefined],
            content: '<div class="section-frame">' +
            "<h4>Saturday Plus <br/>Newspaper</h4>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/news-weekly-or.png'>" +
            '</div>' +
            '</div>',
            properties: this.options.sectionProp
        });


        this.fSurface4 = new Surface({
            size: [undefined, undefined],
            content: '<div class="section-frame">' +
            "<h4>Russian-American <br/> Yellow Pages</h4>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/yp-or.png'>" +
            '</div>' +
            '</div>',
            properties: this.options.sectionProp
        });
        this.renderNode4 = new RenderNode();

        this.stateMod4 = new StateModifier({
            transform: Transform.translate(-this.options.slidePosition, 0, 0)
        });
        this.stateMod4.setTransform(Transform.translate(0, 0, 0),
            {duration: 500, curve: 'linear'}
        );
        this.renderNode4.add(this.stateMod4).add(this.fSurface4);


        this.fSurface5 = new Surface({
            size: [undefined, undefined],
            content: '<div class="section-frame">' +
            "<h4>Radio Program <br/> “OSA”</h4>" +
            '<div class="img-frame">' +
            "<img class='img-responsive' src='../../../../img/home-page/icons-color/radio-or.png'>" +
            '</div>' +
            '</div>',
            properties: this.options.sectionProp
        });
        this.fSurface1.pipe(this._eventOutput);
        this.fSurface2.pipe(this._eventOutput);
        this.fSurface3.pipe(this._eventOutput);
        this.fSurface4.pipe(this._eventOutput);
        this.fSurface5.pipe(this._eventOutput);

        this.contentTop = [];
        this.contentTop.push(this.renderNode2);
        this.contentTop.push(this.fSurface3);
        this.gridContentTop = new GridLayout({dimensions: [2, 1]});
        this.gridContentTop.sequenceFrom(this.contentTop);

        this.contentBottom = [];
        this.contentBottom.push(this.renderNode4);
        this.contentBottom.push(this.fSurface5);
        this.gridContentBottom = new GridLayout({dimensions: [2, 1]});
        this.gridContentBottom.sequenceFrom(this.contentBottom);


        this.flexContent.push(this.fSurface1);
        this.flexContent.push(this.gridContentTop);
        this.flexContent.push(this.gridContentBottom);

        this.layout.sequenceFrom(this.flexContent);

        this.rootNode.add(this.flexMod).add(this.layout);
    }


    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });
        this.contentBacking = new Surface({
            size: [undefined, undefined],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: this.options.contProp.backgroundColor
            }
        });
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.contentBacking);
    }

    HomeCell.prototype = Object.create(View.prototype);
    HomeCell.prototype.constructor = HomeCell;


    module.exports = HomeCell;
});
