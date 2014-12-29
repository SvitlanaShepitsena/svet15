define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');

    var View = require('famous/core/View');

    function HomePage() {
        _createContent.call(this);
    }

    HomePage.prototype = Object.create(Surface.prototype);
    HomePage.prototype.constructor = HomePage;

    HomePage.DEFAULT_OPTIONS = {};

    function _createContent() {

        var page1 = require('text!jade/page1.html');

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: page1,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFFAE2'
            }
        });

    };

    module.exports = HomePage;
});

