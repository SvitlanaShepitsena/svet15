define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var View = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");

    var surfaces = [];

    function HomePageView(genericSync) {
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

    HomePageView.prototype = Object.create(View.prototype);
    HomePageView.prototype.constructor = HomePageView;

    function _addGrid() {

        var home11 = require('text!jade/home11.html');
        var home21 = require('text!jade/home21.html');
        var home12 = require('text!jade/home12.html');
        var home22 = require('text!jade/home22.html');

        this.grid = new GridLayout({
            dimensions: [2, 2],
            gutterSize: [4, 4]
        });

        this.homePages = [];

        this.p11 = new Surface({
            content: home11,
            properties: {
                //backgroundColor: '#E6FFEF'
            }
        });
        this.p12 = new Surface({
            content: home12,
            properties: {
            }
        });
        this.p21 = new Surface({
            content: home21,
            properties: {
            }
        });
        this.p22 = new Surface({
            content: home22,
            properties: {
            }
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

    }

    HomePageView.DEFAULT_OPTIONS = {};

    module.exports = HomePageView;
});
