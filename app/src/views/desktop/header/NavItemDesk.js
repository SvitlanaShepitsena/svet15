define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var EventHandler = require('famous/core/EventHandler');

    function NavItemDesk() {
        View.apply(this, arguments);

        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);
        _init.call(this);
    }

    NavItemDesk.DEFAULT_OPTIONS = {
        itemUrl: null,
        index: -1
    };

    function _init() {
        this.centerModifier = new Modifier({
            size: [undefined, 32],
            align: [0.5, 0.75],
            origin: [0.5, 0.75],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        _navItem.call(this);
    }

    function _navItem() {
        this.itemSurface = new Surface({
            content: this.options.title,
            properties: {
                textAlign: 'center',
                color: window.sv.scheme.textWhite,
                cursor: 'pointer'
            }
        });
        this.itemSurface.on('click', function () {
            this.eventOutput.emit('navigateTo', this.options.index);
        }.bind(this));

        this.rootNode.add(this.itemSurface);
    }

    NavItemDesk.prototype = Object.create(View.prototype);
    NavItemDesk.prototype.constructor = NavItemDesk;

    module.exports = NavItemDesk;
});
