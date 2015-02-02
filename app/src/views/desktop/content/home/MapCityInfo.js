define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');

    MapCityInfo.prototype = Object.create(View.prototype);
    MapCityInfo.prototype.constructor = MapCityInfo;
    MapCityInfo.DEFAULT_OPTIONS = {
        ruSpeakingNum: null,
        city: null
    };

    function MapCityInfo(options) {
        View.apply(this, arguments);

        this.centerModifier = new Modifier({
            transform: Transform.translate(0, 0, 0)
        });
        this.surface = new Surface({
            size: [undefined, undefined],
            content: '<p class="map-info" > <span class="town-name">' + this.options.city + '.</span> <span class = "text-info">' + this.options.ruSpeakingNum + ' %</span> of Russian speaking customers</p>'
        });
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    module.exports = MapCityInfo;
});
