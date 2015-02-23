define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable = require('famous/transitions/Transitionable');


    MapsLegendCell.prototype = Object.create(View.prototype);
    MapsLegendCell.prototype.constructor = MapsLegendCell;

    MapsLegendCell.DEFAULT_OPTIONS = {
        legendContent: null,
        legendOpacity: null,
        legendColor: null
    };

    function MapsLegendCell(options) {
        View.apply(this, arguments);
        _init.call(this);
    }

    function _init() {
        this.legendTrans = new Transitionable(0);

        this.legendMod = new Modifier({
            size: [170, 50],
            align: [0, 0],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.legendTrans.get();
            }.bind(this)
        });
        this.legendSurf = new Surface({
            content: this.options.legendContent,
            properties: {
                color: window.sv.scheme.textDark,
                zIndex: 0
            }
        });

        this.rootNode = this.add(this.legendMod);
        this.rootNode.add(this.legendSurf);
    }


    MapsLegendCell.prototype.show = function () {
        this.legendTrans.set(1, {duration: 500});
        this.legendSurf.setOptions({properties: {zIndex: 10}});
    }
    MapsLegendCell.prototype.hide = function () {
        this.legendTrans.set(0, {duration: 500});
        this.legendSurf.setOptions({properties: {zIndex: -1}});
    }

    module.exports = MapsLegendCell;
});
