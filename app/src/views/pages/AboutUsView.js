define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var View = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");
    var Easing = require('famous/transitions/Easing');

    var ImageSurface = require('famous/surfaces/ImageSurface');

    var MenuImageView = require('views/pages/aboutUs/MenuImageView');

    function AboutUsView(genericSync) {
        this.genericSync = genericSync;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var bgModifier = new Modifier({
            size: [undefined, undefined]
        });

        this.bg = new Surface({
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.rootNode = this.add(bgModifier);
        this.rootNode.add(this.bg);

        _addGrid.call(this);
    }

    AboutUsView.prototype = Object.create(View.prototype);
    AboutUsView.prototype.constructor = AboutUsView;

    function _addGrid() {
        var that = this;
        this.contentModifier = new Modifier({
            size: [undefined, undefined],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, window.innerHeight * .015, 0)
        });

        this.grid = new GridLayout({
            dimensions: [1, 2]
        });

        this.menus = [];
        //this.leftMenu = new MenuImageView('../img/aboutUs/aboutus_1.jpg');
        this.leftMenu = new MenuImageView('<img src="../img/aboutUs/aboutus_1.jpg"/>',1)
        this.rightMenu = new MenuImageView('<img src="../img/aboutUs/aboutus_2.jpg"/>',2)

        this.menus.push(this.leftMenu);
        this.menus.push(this.rightMenu);

        this.grid.sequenceFrom(this.menus);

        this.add(this.contentModifier).add(this.grid);
    }

    AboutUsView.DEFAULT_OPTIONS = {};

    module.exports = AboutUsView;
});
