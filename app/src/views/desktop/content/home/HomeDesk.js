/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsCell = require('dviews/content/home/MapsDesk');


    function HomeDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _addColorBackground.call(this);
        _fillHomeContent.call(this);
    }

    HomeDesk.prototype = Object.create(View.prototype);
    HomeDesk.prototype.constructor = HomeDesk;

    HomeDesk.DEFAULT_OPTIONS = {};

    function _init() {
        this.centerModifier = new Modifier({
            size: [undefined, undefined]
        });
        this.mapBackdrop = new MapsCell();
        this.mapBackdrop.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.mapBackdrop);
    }

    function _addColorBackground() {
        this.backdropMod = new Modifier({
            opacity: 0.85,
            size: [undefined, window.innerHeight - window.sv.sizing.headerHeight],
            transform: Transform.translate(0, window.sv.sizing.headerHeight, 0)
        });
        this.backdropSurf = new Surface({
            properties: {
                textAlign: 'center',
                backgroundColor: '#3D566E'
            }
        });
        this.backdropSurf.pipe(this._eventOutput);
        this.rootNode.add(this.backdropMod).add(this.backdropSurf);
    }

    function _fillHomeContent() {
        this.homeContentDesk = new HomeContentDesk();
        this.rootNode.add(this.homeContentDesk);
    }

    module.exports = HomeDesk;
});
