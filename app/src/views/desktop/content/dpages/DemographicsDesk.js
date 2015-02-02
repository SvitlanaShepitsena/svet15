define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function DemographicsDesk() {
        View.apply(this, arguments);
        _init.call(this);

        this.surfaceBg = new Surface({
            size: [undefined, undefined],
            content: 'Demographics',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });
        this.surfaceBg.pipe(this._eventOutput);
        this.rootNode.add(this.surfaceBg);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    DemographicsDesk.prototype = Object.create(View.prototype);
    DemographicsDesk.prototype.constructor = DemographicsDesk;

    DemographicsDesk.DEFAULT_OPTIONS = {};

    module.exports = DemographicsDesk;
});
