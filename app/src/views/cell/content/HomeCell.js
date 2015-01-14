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
    var HomePart = require('views/cell/content/home/HomePart');

    function HomeCell() {
        View.apply(this, arguments);
        _init.call(this);
        _flex.call(this);
    }

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
            properties: {
                padding: '10px',
                textAlign: "center"
            }
        });
    this.fSurface1.pipe(this._eventOutput);
        this.renderNode2 = new HomePart({
            sign: -1,
            content: 'part 11'
        })
        this.renderNode3 = new HomePart({
            sign: 1,
            content: 'part 12'
        })
        this.renderNode4 = new HomePart({
            sign: -1,
            content: 'part 21'
        })
        this.renderNode5 = new HomePart({
            sign: 1,
            content: 'part 22'
        })
        this.renderNode2.pipe(this._eventOutput);
        this.renderNode3.pipe(this._eventOutput);
        this.renderNode4.pipe(this._eventOutput);
        this.renderNode5.pipe(this._eventOutput);

        this.contentTop = [];
        this.contentTop.push(this.renderNode2);
        this.contentTop.push(this.renderNode3);
        this.gridContentTop = new GridLayout({dimensions: [2, 1]});
        this.gridContentTop.sequenceFrom(this.contentTop);

        this.contentBottom = [];
        this.contentBottom.push(this.renderNode4);
        this.contentBottom.push(this.renderNode5);
        this.gridContentBottom = new GridLayout({dimensions: [2, 1]});
        this.gridContentBottom.sequenceFrom(this.contentBottom);


        this.flexContent.push(this.fSurface1);
        this.flexContent.push(this.gridContentTop);
        this.flexContent.push(this.gridContentBottom);

        this.layout.sequenceFrom(this.flexContent);

        this.rootNode.add(this.flexMod).add(this.layout);
    }

    HomeCell.DEFAULT_OPTIONS = {
        height: window.innerHeight,
        width: window.innerWidth,
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
