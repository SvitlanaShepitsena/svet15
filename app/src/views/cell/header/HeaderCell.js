define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    function HeaderCell() {
        View.apply(this, arguments);

        _createHeader.call(this);
        _setListeners.call(this);
    }

    HeaderCell.prototype = Object.create(View.prototype);
    HeaderCell.prototype.constructor = HeaderCell;
    function _createHeader() {

        this.backgroundSurface = new Surface({
            size: [undefined, undefined],
            opacity: 0.5,
            properties: {
                backgroundColor: window.sv.scheme.headerColor
            }
        });

        this.hamburgerModifier = new Modifier({
            transform: Transform.translate(0, 0, 2)
        });
        this.hamburgerSurface = new Surface({
            size: [undefined, undefined],
            content: '<img class="img-hamb" src="../../../../img/hamburger-template.png"/>',
            properties: {
                zIndex: '10'
            }
        });

        this.titleModifier = new Modifier({
            transform: Transform.translate(0, 0, 1),
            origin: [0.5, 0],
        align: [0.5, 0]
        });
        this.titleSurface = new Surface({
            size: [undefined, undefined],
            content: '<h1 class="svet-h">SVET Media Group</h1>',
            properties: {
                textAlign: 'center',
                color: window.sv.scheme.textYellow
            }
        });


        this._add(this.titleModifier).add(this.titleSurface);
        this._add(this.hamburgerModifier).add(this.hamburgerSurface);

        this._add(this.backgroundSurface);
    }

    function _setListeners() {
        this.hamburgerSurface.on('touchstart', function () {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('mousedown', function () {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('click', function () {
            this.hamburgerModifier.setOpacity(1);
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = HeaderCell;
});
