define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var EdgeSwapper = require("famous/views/EdgeSwapper");

    function FooterCell() {
        View.apply(this, arguments);
        _init.call(this);
        _ad.call(this);
    }

    function _ad() {
        /**
         *  EdgeSwapper
         */
        this.elements = ['1', '2', '3', '4'];

        this.adSwapper = new EdgeSwapper();

        this.surfaces = [];
        this.counter = 0;

        for (var i = 0; i < this.elements.length; i++) {
            var surf = new Surface({
                size: [undefined, undefined],
                content: "<img class='ravinia-img' src='../img/footer-ad/ravinia--ad.png'>",
                properties: {
                    color: 'white',
                    fontSize: '22px',
                    textAlign: 'center',
                    backgroundColor: "black"
                }
            });

            surf.on('click', function () {
                this.counter = this.counter == this.surfaces.length - 1 ? 0 : this.counter + 1;
                this.adSwapper.show(this.surfaces[this.counter]);
            }.bind(this));

            this.surfaces.push(surf);
        }

        this.rootNode.add(this.adSwapper);

        this.adSwapper.show(this.surfaces[this.counter]);

    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    FooterCell.prototype = Object.create(View.prototype);
    FooterCell.prototype.constructor = FooterCell;

    FooterCell.DEFAULT_OPTIONS = {};

    module.exports = FooterCell;
});
