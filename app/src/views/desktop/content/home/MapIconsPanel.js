/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Slider = require('famous/widgets/Slider');
    var VideoSurface = require('famous/surfaces/VideoSurface');
    var RenderNode = require('famous/core/RenderNode');

    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsDesk = require('dviews/content/home/MapsDesk');


    MapIconsPanel.DEFAULT_OPTIONS = {
        satPaperWidth: '100px',
        satPaperHeight: '50px',
        iconsPanelSize: [90, 40],
        iconsGridSize: [100, 40],
        mapIconProps: {
            cursor: 'pointer'
        }
    };

    function MapIconsPanel() {
        View.apply(this, arguments);
        this.iconElements = [];
        _init.call(this);
        _mapIcons.call(this);
        _logoSaturday.call(this);
        _logoNewLight.call(this);
        _logoYp.call(this);
    }

    function _init() {
        this.iconPanelTrans = new Transitionable(0);

        this.centerModifier = new Modifier({
            align: [0.6, 0],
            origin: [0.5, 0.2],
            size: this.options.iconsPanelSize,
            opacity: function () {
                return this.iconPanelTrans.get();
            }.bind(this),
            transform: Transform.translate(-10, 0, 0)

        });
        this.rootNode = this.add(this.centerModifier);
    }

    MapIconsPanel.prototype = Object.create(View.prototype);
    MapIconsPanel.prototype.constructor = MapIconsPanel;

    MapIconsPanel.prototype.animateUp = function () {
        this.iconPanelTrans.halt();
        this.iconPanelTrans.set(1, {duration: 1000, curve: "easeOutBounce"});


    }


    MapIconsPanel.prototype.animateDown = function () {
        this.iconPanelTrans.halt();
        this.iconPanelTrans.set(0, {duration: 1000, curve: "easeOutBounce"});
    }


    /** =Map Svet Icons
     */

    /*=Raphael Icon Design*/

    function _logoSaturday() {
        var divSat = document.createElement('div');
        divSat.style.position = 'relative';
        var paper = Raphael(divSat, 100, 50);
        var text = paper.text(50, 10, 'Суббота+');
        text.attr({
            'stroke': 'none',
            'fill': '#595959',
            'font-size': 18,
            'font-weight': 'bold',
            'line-height': 20,
            'font-family': "Myriad Pro"
        });
        this.logoSvgMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(-30, 96, 0)
        });
        this.logoSatSurf = new Surface({
            content: divSat,
            properties: {
                cursor: 'pointer'
            }
        });
        this.logoSatSurf.pipe(this._eventOutput);
        this.logoSatSurf.on('click', function () {
            this._eventOutput.emit('show:svetPoints');
        }.bind(this));
        this.rootNode.add(this.logoSvgMod).add(this.logoSatSurf);
    }


    function _logoNewLight() {
        var divNewWorld = document.createElement('div');
        var paper = Raphael(divNewWorld, 135, 50);
        var text = paper.text(65, 10, 'НОВЫЙ СВЕТ');

        text.attr({
            stroke: 'none',
            'fill': '#595959',
            'font-size': 18,
            'line-height': 20,
            'font-weight': 'bold',
            'font-family': "Myriad Pro"
        });
        this.newSvetMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(-30, 127, 0)
        });
        this.newSvetSurf = new Surface({
            content: divNewWorld,
            properties: {
                cursor: 'pointer'
            }
        });
        this.newSvetSurf.pipe(this._eventOutput);
        this.newSvetSurf.on('click', function () {
            this._eventOutput.emit('show:svetPoints');
        }.bind(this));
        this.rootNode.add(this.newSvetMod).add(this.newSvetSurf);
    }


    function _logoYp() {
        var divYp = document.createElement('div');
        var paper = Raphael(divYp, 150, 50);
        var text = paper.text(68, 10, 'Yellow Pages');

        text.attr({
            'stroke': 'none',
            'fill': '#595959',
            'font-weight': 'bold',
            'font-size': 18,
            'line-height': 20,
            'font-family': "Myriad Pro"
        });
        this.YpMod = new Modifier({
            transform: Transform.translate(-35, 155, 0)
        });
        this.YpSurf = new Surface({
            content: divYp,
            properties: {
                cursor: 'pointer'
            }
        });
        this.YpSurf.pipe(this._eventOutput);
        this.YpSurf.on('click', function () {
            this._eventOutput.emit('show:ypCompanies');
        }.bind(this));
        this.rootNode.add(this.YpMod).add(this.YpSurf);
    }


    function _mapIcons() {
        this.iconBgMod = new Modifier({
            size: [300, 180],
            align: [0.5, 0.75],
            origin: [0.3, 0],

            opacity: function () {
                return this.iconPanelTrans.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });

        /*Map Icons Panel*/
        this.mapIconsBg = new Surface({
            content: '<h class="text-info">Svet Distribution Points</h><hr/>',
            properties: {
                border: '1px',
                fontSize: '19px',
                padding: '15px',
                paddingTop: '20px',
                borderStyle: 'solid',
                fontWeight: 'bold',
                borderColor: '#999999',
                boxShadow: window.sv.scheme.boxShadow,
                backgroundColor: 'floralwhite'
            }
        });


        /*Grid Layout for Map Icons*/
        this.iconPanelTrans = new Transitionable(0);


        this.rootNode.add(this.iconBgMod).add(this.mapIconsBg);

    }

    module.exports = MapIconsPanel;
});
