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

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        _navItem.call(this);
    }

    function _navItem() {
        this.itemSurface = new ImageSurface({
            size: [100, 110],
            properties: {
                cursor: 'pointer'
            }
        });
        this.itemSurface.setContent(this.options.itemUrl);
        this.itemSurface.on('click', function () {
            this.eventOutput.emit('navigateTo', this.options.index);
        }.bind(this));

        this.rootNode.add(this.itemSurface);

    }

    NavItemDesk.prototype = Object.create(View.prototype);
    NavItemDesk.prototype.constructor = NavItemDesk;

    NavItemDesk.DEFAULT_OPTIONS = {
        itemUrl: null,
        index: -1
    };

    module.exports = NavItemDesk;
});
