define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    yp.prototype = Object.create(View.prototype);
    yp.prototype.constructor = yp;
    yp.DEFAULT_OPTIONS = {
        surfopts: {
            color: 'white',
            textAlign: 'center',
            backgroundColor: '#FA5C4F'
        }
    };

    function yp() {
        this.background = '#363536';
        this.border = '1px solid #E5E5E5';
        View.apply(this, arguments);
        _init.call(this);
        _ypSvg.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [138, 30],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.surface = new Surface({
            content: _ypSvg.call(this),
            properties: {
                backgroundColor: this.background,
                boxShadow: window.sv.scheme.boxShadow,
                border: this.border,
                cursor: 'pointer'
            }
        });
        this.surface.pipe(this._eventOutput);

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    function _ypSvg() {
        var divYp = document.createElement('div');
        divYp.style.height = '30px';

        var paper = Raphael(divYp, 138, 30);
        var text = paper.text(68, 10, 'Yellow Pages');
        text.attr({
            'stroke': 'none',
            'gradient': '90-#F2B263-#F2EB80-#F2B263',
            'font-weight': 'bold',
            'font-size': 18,
            'font-family': "Myriad Pro"
        });
        paper.renderfix();
        return divYp;
    }

    module.exports = yp;
});
