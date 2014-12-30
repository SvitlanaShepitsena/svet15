define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var View = require('famous/core/View');

    function NavigationView() {
        View.apply(this, arguments);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

        _createIcon.call(this);
    }

    NavigationView.prototype = Object.create(View.prototype);
    NavigationView.prototype.constructor = NavigationView;

    NavigationView.DEFAULT_OPTIONS = {
        width: null,
        height: null,
        iconUrl: null,
        index: null
    };

    function _createIcon() {
        var that = this;
        var iconSurface = new Surface({
            content: '<img width="191" src="' + this.options.iconUrl + '"/>'
        });
        iconSurface.on('click', function () {
            that.eventOutput.emit('pageChange', that.options.index);
        })
        this._add(iconSurface);
    };

    module.exports = NavigationView;
});
