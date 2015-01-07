/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require("famous/core/Modifier");


    function AppView() {
        View.apply(this, arguments);
        var centerModifier = new Modifier({
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        var primary = new Surface({
            size: [undefined, undefined],
            content: "Hello!",
            properties: {
                backgroundColor: 'red',
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });
        this.add(centerModifier).add(primary);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
