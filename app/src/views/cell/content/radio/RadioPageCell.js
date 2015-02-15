define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    /*Require App*/
    var CommonPageCell = require('cviews/content/common/CommonPageCell');

    RadioPageCell.prototype = Object.create(View.prototype);
    RadioPageCell.prototype.constructor = RadioPageCell;
    RadioPageCell.DEFAULT_OPTIONS = {
        surfopts: {
            //color: window.sv.scheme.textWhite,
            textAlign: 'center'
        }
    };

    function RadioPageCell() {
        View.apply(this, arguments);
        _init.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        fn

        this.surface = new Surface({
            properties: this.options.surfopts
        });
        this.surface.pipe(this._eventOutput);

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    module.exports = RadioPageCell;
});
