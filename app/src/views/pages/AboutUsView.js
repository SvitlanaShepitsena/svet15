define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var View = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");

    var Easing = require('famous/transitions/Easing');

    function AboutUsView(genericSync) {
        this.genericSync = genericSync;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });

        var transform = new Modifier({
            transform: Transform.translate(0, 0, 0)
        });

        this.bg = new Surface({
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.rootNode = this.add(centerModifier);
        this.rootNode.add(this.bg);

        _addGrid.call(this);
    }

    AboutUsView.prototype = Object.create(View.prototype);
    AboutUsView.prototype.constructor = AboutUsView;

    function _addGrid() {

        var home11 = require('text!jade/home11.html');
        var home21 = require('text!jade/home21.html');
        var home12 = require('text!jade/home12.html');
        var home22 = require('text!jade/home22.html');

        this.resDim = function () {
            if (window.innerWidth < 480) {
                return [2, 1];
            }
            return [2, 2];
        }
        this.grid = new GridLayout({
            dimensions: window.innerWidth < 490?[2,1]:[2, 2],
            transition: {curve: 'easeInOut',duration: 200}
        });

        this.homePages = [];

        this.p11 = new Surface({
            content: home11,
            properties: {}
        });
        this.p12 = new Surface({
            content: home12,
            properties: {}
        });
        this.p21 = new Surface({
            content: home21,
            properties: {}
        });
        this.p22 = new Surface({
            content: home22,
            properties: {}
        });

        this.homePages.push(this.p11);
        this.homePages.push(this.p12);
        this.homePages.push(this.p21);
        this.homePages.push(this.p22);

        this.grid.sequenceFrom(this.homePages);

        this.p11.pipe(this.genericSync);
        this.p12.pipe(this.genericSync);
        this.p21.pipe(this.genericSync);
        this.p22.pipe(this.genericSync);

        this.add(this.grid);
        var that = this;
        Engine.on('resize', function () {
            that.grid.setOptions({dimensions: window.innerWidth < 490?[2,1]:[2, 2]});
        })
    }

    AboutUsView.DEFAULT_OPTIONS = {};

    module.exports = AboutUsView;
});
