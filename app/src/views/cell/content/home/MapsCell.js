define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var MapView = require('fmaps/MapView');
    var Transitionable = require('famous/transitions/Transitionable');
    var MapModifier = require('fmaps/MapModifier');
    var Easing = require('famous/transitions/Easing');


    function MapsCell() {
        View.apply(this, arguments);
        _init.call(this);
        _map.call(this);
    }

    function _modifier() {

        this.surface = new Surface({
            size: [50, 50],
            properties: {
                backgroundColor: 'white'
            }
        });
        this.modifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        this.mapModifier = new MapModifier({
            mapView: this.mapView,
            position: {lat: 51.4484855, lng: 5.451478}
        });
        this.rootNode.add(this.mapModifier).add(this.surface);
    }

    function _map() {
        this.northChicagoStart = {lat: 41.850033, lng: -87.6500523};
        this.northChicagoEnd = {lat: 41.95, lng: -87.6500523};
        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                zoom: 9,
                center: this.northChicagoStart,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }
        });
        this.rootNode.add(this.mapView);

        this.mapView.on('load', function () {
            this.mapView.setPosition(
                this.northChicagoEnd,
                {duration: 5000, curve: Easing.outBack}
            );
        }.bind(this));

    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    MapsCell.prototype = Object.create(View.prototype);
    MapsCell.prototype.constructor = MapsCell;

    MapsCell.DEFAULT_OPTIONS = {};

    module.exports = MapsCell;
});
