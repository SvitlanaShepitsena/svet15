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

    var HomePart = require('cviews/content/home/HomePart');
    var MapsCell = require('cviews/content/home/MapsCell');

    var grid11 = require('text!cviews/content/home/jade/grid11.html');
    var grid12 = require('text!cviews/content/home/jade/grid12.html');
    var grid21 = require('text!cviews/content/home/jade/grid21.html');
    var grid22 = require('text!cviews/content/home/jade/grid22.html');

    function HomeCell() {
        View.apply(this, arguments);

        _init.call(this);
        _flex.call(this);
        _gridParts.call(this);
    }

    HomeCell.DEFAULT_OPTIONS = {
        center: [0.5, 0.5],
        height: window.innerHeight,
        width: window.innerWidth,
        color: 'white',
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

    HomeCell.prototype = Object.create(View.prototype);
    HomeCell.prototype.constructor = HomeCell;

    function _gridParts() {

        this.renderNode2 = new HomePart({
            sign: -1,
            duration: 300,
            content: grid11
        })
        this.renderNode3 = new HomePart({
            sign: 1,
            duration: 300,
            content: grid12
        })
        this.renderNode4 = new HomePart({
            sign: -1,
            duration: 500,
            content: grid21
        })
        this.renderNode5 = new HomePart({
            sign: 1,
            duration: 500,
            content: grid22
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


        this.flexContent.push(this.gridContentTop);
        this.flexContent.push(this.gridContentBottom);
    }

    function _flex() {
        this.flexMod = new Modifier({
            align: this.options.center,
            origin: this.options.center
        });
        this.layout = new FlexibleLayout({
            ratios: [2, 2, 2],
            direction: 1
        });
        this.flexContent = [];

        this.maps = new MapsCell();

        this.maps.pipe(this._eventOutput);
        this.flexContent.push(this.maps);


        this.layout.sequenceFrom(this.flexContent);

        this.rootNode.add(this.flexMod).add(this.layout);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: this.options.center,
            origin: this.options.center
        });
        this.contentBacking = new Surface({
            size: [undefined, undefined],
            properties: {
                color: this.options.color,
                textAlign: this.options.textAlign,
                backgroundColor: this.options.contProp.backgroundColor
            }
        });
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.contentBacking);
    }

    module.exports = HomeCell;
});
