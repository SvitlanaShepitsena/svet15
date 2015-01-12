define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function RadioDesk() {
        View.apply(this, arguments);
        _init.call(this);

        this.surface = new Surface({
            size: [undefined, undefined],
            content: 'Radio',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'Indigo'
            }
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.surface);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    RadioDesk.prototype = Object.create(View.prototype);
    RadioDesk.prototype.constructor = RadioDesk;

    RadioDesk.DEFAULT_OPTIONS = {};

    module.exports = RadioDesk;
});
