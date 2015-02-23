define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    ArrowDown.prototype = Object.create(View.prototype);
    ArrowDown.prototype.constructor = ArrowDown;
    ArrowDown.DEFAULT_OPTIONS = {
        arrowOopts: {
            zIndex: 10,
            cursor: 'pointer'
        }
    };

    function ArrowDown() {
        View.apply(this, arguments);
        _init.call(this);
        _arrowDown.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            transform: Transform.translate(0, 0, .1)
        });
        this.rootNode = this.add(this.centerModifier);
    }


    function _arrowDown() {
        var arrowDiv = document.createElement('div');
        var paper = Raphael(arrowDiv, 84, 40);

        paper.path('M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z').attr({
            fill: 'black',
            opacity: .5,
            stroke: 'white'
        }).transform('t8.5,0r270s2.4');


        this.surface = new Surface({
            content: arrowDiv,
            properties: {
                zIndex: 10,
                cursor: 'pointer'
            }
        });
        this.surface.pipe(this._eventOutput);
        this.rootNode.add(this.surface);
    }
    module.exports = ArrowDown;
});
