define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    ArrowUp.prototype = Object.create(View.prototype);
    ArrowUp.prototype.constructor = ArrowUp;
    ArrowUp.DEFAULT_OPTIONS = {
        arrowOopts: {
            zIndex: 10,
            cursor: 'pointer'
        }
    };

    function ArrowUp() {
        View.apply(this, arguments);
        _init.call(this);
        _arrowUp.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            transform: Transform.translate(4, 80, 1)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    function _arrowUp() {
        var arrowDiv = document.createElement('div');
        arrowDiv.style.height = '35px';
        var arrowPaper = Raphael(arrowDiv, 60, 35);

        arrowPaper.path('M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z').attr({
            fill: 'black',
            opacity: .8,
            stroke: 'white'
        }).transform('...s2.4 t8.5,0 r90');

        this.surface = new Surface({
            content: arrowDiv,
            properties: this.options.arrowOpts
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.surface);
    }

    module.exports = ArrowUp;
});
