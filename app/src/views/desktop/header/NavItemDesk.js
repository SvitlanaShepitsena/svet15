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
        _navItem.call(this);
    }

    NavItemDesk.DEFAULT_OPTIONS = {
        title: null,
        itemUrl: null,
        size: [undefined, 32],
        align: [0.5, 0.72],
        origin: [0.5, 0.72],
        index: -1,
        navBtnOpts: {
            textAlign: 'center',
            color: window.sv.scheme.textWhite,
            cursor: 'pointer',
            fontSize: '14px'
        }
    };

    function _navItem() {
        this.centerModifier = new Modifier({
            size: this.options.size,
            align: this.options.align,
            origin: this.options.origin
        });
        this.itemSurface = new Surface({
            content: this.options.title,
            properties: this.options.navBtnOpts
        });

        this.itemSurface.on('click', function () {
            this.eventOutput.emit('navigateTo', this.options.index);
        }.bind(this));

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.itemSurface);
    }

    NavItemDesk.prototype = Object.create(View.prototype);
    NavItemDesk.prototype.constructor = NavItemDesk;

    module.exports = NavItemDesk;
});
