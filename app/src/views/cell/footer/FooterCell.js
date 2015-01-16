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

    FooterCell.prototype = Object.create(View.prototype);
    FooterCell.prototype.constructor = FooterCell;

    FooterCell.DEFAULT_OPTIONS = {
        footerOpts: {
            color: null,
            fontSize: null,
            textAlign: 'center',
            backgroundColor: null
        }
    };

    function _ad() {
        /**
         *  EdgeSwapper
         */
        this.elements = ['1', '2', '3', '4'];

        this.adSwapper = new EdgeSwapper();

        this.surfaces = [];
        this.counter = 0;

        for (var i = 0; i < this.elements.length; i++) {
            this.surf = new Surface({
                size: [undefined, undefined],
                //content: "<img class='ravinia-img' src='../img/footer-ad/ravinia--ad.png'>",
                properties: {
                    backgroundColor: window.sv.scheme.footerColor
                }
            });

            this.surf.on('click', function () {
                this.counter = this.counter == this.surfaces.length - 1 ? 0 : this.counter + 1;
                this.adSwapper.show(this.surfaces[this.counter]);
            }.bind(this));
            this.surfaces.push(this.surf);
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

    module.exports = FooterCell;
});
