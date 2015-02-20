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

    var Saturday = require('views/raphaelImg/saturday');
    var NewLight = require('views/raphaelImg/newLight');
    var Yp = require('views/raphaelImg/yp');


    MapIconsPanel.DEFAULT_OPTIONS = {
        fillDark: '#393939',
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
    /*Converted*/
    /*Converted End*/

    function _logoSaturday() {
        this.saturday = new Saturday();

        this.logoSvgMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(-30, 96, 0)
        });
        this.saturday.pipe(this._eventOutput);
        this.saturday.on('click', function () {
            this._eventOutput.emit('show:svetPoints');
        }.bind(this));
        this.rootNode.add(this.logoSvgMod).add(this.saturday);
    }


    function _logoNewLight() {
        this.newSvetMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(-30, 127, 0)
        });
        this.newLight = new NewLight();
        this.newLight.pipe(this._eventOutput);
        this.newLight.on('click', function () {
            this._eventOutput.emit('show:svetPoints');
        }.bind(this));
        this.rootNode.add(this.newSvetMod).add(this.newLight);
    }


    function _logoYp() {
        this.yp = new Yp();
        this.ypMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(-30, 165, 0)
        });
        this.yp.pipe(this._eventOutput);
        this.yp.on('click', function () {
            this._eventOutput.emit('show:ypCompanies');
        }.bind(this));

        this.rootNode.add(this.ypMod).add(this.yp);

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
                backgroundColor: window.sv.scheme.aboutDesk
            }
        });


        /*Grid Layout for Map Icons*/
        this.iconPanelTrans = new Transitionable(0);


        this.rootNode.add(this.iconBgMod).add(this.mapIconsBg);
    }


    module.exports = MapIconsPanel;
});
